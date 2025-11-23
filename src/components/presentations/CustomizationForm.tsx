'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getTemplate } from '@/lib/presentations/template-registry';
import { createCustomizedPresentation } from '@/lib/presentations/customization';
import { createInstance } from '@/lib/services/instances';
import { createQuestions } from '@/lib/services/questions';
import { createPresentation } from '@/lib/services/presentations';
import { useAuth } from '@/components/auth/AuthProvider';
import { CustomQuestion } from '@/types/presentation';
import { supabase } from '@/lib/supabase/client';

interface CustomizationFormProps {
  templateId: string;
  onSuccess?: (instanceId: string, shareToken: string) => void;
}

type Step = 'name' | 'email' | 'link' | 'advanced' | 'complete';

export default function CustomizationForm({ templateId, onSuccess }: CustomizationFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Simple customization fields
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [storeLink, setStoreLink] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>('name');
  
  // Advanced customization
  const [useAdvanced, setUseAdvanced] = useState(false);
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);

  // Focus input when step changes
  useEffect(() => {
    if (inputRef.current && currentStep !== 'advanced' && currentStep !== 'complete') {
      inputRef.current.focus();
    }
  }, [currentStep]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        questionType: 'text',
        position: questions.length + 1,
        isRequired: false,
      },
    ]);
  };

  const updateQuestion = (index: number, updates: Partial<CustomQuestion>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, step: Step) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNextStep(step);
    }
  };

  const handleNextStep = (current: Step) => {
    // Validate current step before moving forward
    if (current === 'name' && !recipientName.trim()) {
      setError('Please enter a recipient name');
      return;
    }
    if (current === 'email' && recipientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    if (current === 'link' && storeLink && !/^https?:\/\/.+/.test(storeLink)) {
      setError('Please enter a valid URL (starting with http:// or https://)');
      return;
    }

    setError('');
    
    // Move to next step
    switch (current) {
      case 'name':
        setCurrentStep('email');
        break;
      case 'email':
        setCurrentStep('link');
        break;
      case 'link':
        if (useAdvanced && questions.length === 0) {
          setCurrentStep('advanced');
        } else {
          handleSubmit();
        }
        break;
      case 'advanced':
        handleSubmit();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'email':
        setCurrentStep('name');
        break;
      case 'link':
        setCurrentStep('email');
        break;
      case 'advanced':
        setCurrentStep('link');
        break;
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    setCurrentStep('complete');

    try {
      if (!user) throw new Error('Not authenticated');

      // Get template
      const template = getTemplate(templateId);
      if (!template) throw new Error('Template not found');

      // Create customized presentation
      const customized = createCustomizedPresentation(template, {
        level: useAdvanced ? 'advanced' : 'simple',
        simple: {
          recipientName,
          storeLink,
        },
        questions: useAdvanced ? questions.filter(q => q.questionText.trim()) : undefined,
      });

      // First, create a presentation record in the presentations table
      let presentation;
      try {
        presentation = await createPresentation({
          template_id: templateId,
          name: `${template.name} - ${recipientName}`,
          description: template.description || `Customized presentation for ${recipientName}`,
          created_by: user.id,
          is_public: false,
        });
      } catch (err: any) {
        // Check if this is a foreign key constraint error
        if (err.message?.includes('foreign key constraint') || 
            err.message?.includes('presentations_created_by_fkey')) {
          throw new Error('User profile not found. Please try logging out and logging back in. If the problem persists, contact support.');
        }
        throw err;
      }

      // Then create instance with the presentation UUID
      const instance = await createInstance({
        presentation_id: presentation.id,
        created_by: user.id,
        recipient_name: recipientName || null,
        recipient_email: recipientEmail || null,
        store_link: storeLink || null,
        customization_level: useAdvanced ? 'advanced' : 'simple',
        custom_fields: customized.customization.simple as any,
        status: 'draft',
      });

      // Create questions if advanced
      if (useAdvanced && questions.length > 0) {
        const validQuestions = questions
          .filter(q => q.questionText.trim())
          .map((q, idx) => ({
            instance_id: instance.id,
            question_text: q.questionText,
            question_type: q.questionType,
            position: q.position || idx + 1,
            is_required: q.isRequired || false,
            options: q.options ? q.options as any : null,
          }));

        if (validQuestions.length > 0) {
          await createQuestions(validQuestions);
        }
      }

      // Mark as sent
      const { error: updateError } = await supabase
        .from('presentation_instances')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', instance.id);

      if (updateError) {
        throw new Error(`Failed to update presentation status: ${updateError.message}`);
      }

      // Use the share_token from the created instance
      if (onSuccess && instance.share_token) {
        onSuccess(instance.id, instance.share_token);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create presentation');
    } finally {
      setLoading(false);
    }
  };

  const getStepLabel = (step: Step) => {
    switch (step) {
      case 'name': return 'Recipient Name';
      case 'email': return 'Recipient Email';
      case 'link': return 'Store/Product Link';
      case 'advanced': return 'Custom Questions';
      default: return '';
    }
  };

  const getStepPlaceholder = (step: Step) => {
    switch (step) {
      case 'name': return 'e.g., John Doe';
      case 'email': return 'recipient@example.com (optional)';
      case 'link': return 'https://yourstore.com (optional)';
      default: return '';
    }
  };

  const getStepValue = (step: Step) => {
    switch (step) {
      case 'name': return recipientName;
      case 'email': return recipientEmail;
      case 'link': return storeLink;
      default: return '';
    }
  };

  const setStepValue = (step: Step, value: string) => {
    switch (step) {
      case 'name': setRecipientName(value); break;
      case 'email': setRecipientEmail(value); break;
      case 'link': setStoreLink(value); break;
    }
  };

  const getStepType = (step: Step) => {
    switch (step) {
      case 'name': return 'text';
      case 'email': return 'email';
      case 'link': return 'url';
      default: return 'text';
    }
  };

  const isStepRequired = (step: Step) => {
    return step === 'name';
  };

  return (
    <div className="relative">
      {/* Advanced Options Side Panel */}
      <div className="absolute right-0 top-0">
        <button
          type="button"
          onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 border border-slate-600 rounded-lg bg-slate-800/50 backdrop-blur-sm shadow-sm hover:bg-slate-700 transition-colors"
          title="Advanced Options"
        >
          ⚙️ Advanced
        </button>
        
        {showAdvancedPanel && (
          <div className="absolute right-0 top-8 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 z-10 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">Advanced Options</h4>
              <button
                type="button"
                onClick={() => setShowAdvancedPanel(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={useAdvanced}
                onChange={(e) => {
                  setUseAdvanced(e.target.checked);
                  if (!e.target.checked) {
                    setQuestions([]);
                  }
                }}
                className="w-4 h-4 text-indigo-600 border-slate-600 rounded bg-slate-700 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-300">Add Custom Questions</span>
            </label>

            {useAdvanced && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="w-full px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-500 transition-colors"
                >
                  + Add Question
                </button>

                {questions.map((question, index) => (
                  <div key={index} className="p-3 border border-slate-700 rounded-lg space-y-2 bg-slate-900/50">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-medium text-slate-400">Q{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="text-red-400 hover:text-red-300 text-xs transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <input
                      type="text"
                      value={question.questionText}
                      onChange={(e) => updateQuestion(index, { questionText: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-slate-600 rounded bg-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Question text"
                    />
                    <select
                      value={question.questionType}
                      onChange={(e) => updateQuestion(index, { questionType: e.target.value as any })}
                      className="w-full px-2 py-1 text-xs border border-slate-600 rounded bg-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="text">Text</option>
                      <option value="yes_no">Yes/No</option>
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-red-300 backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Step-by-step form */}
        {currentStep !== 'complete' && currentStep !== 'advanced' && (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  currentStep === 'name' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-110' : recipientName ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {recipientName ? '✓' : '1'}
                </div>
                <div className={`w-1 h-8 ${
                  recipientName ? 'bg-emerald-600' : 'bg-slate-700'
                } transition-colors duration-300`} />
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  currentStep === 'email' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-110' : recipientEmail ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {recipientEmail ? '✓' : '2'}
                </div>
                <div className={`w-1 h-8 ${
                  recipientEmail ? 'bg-emerald-600' : 'bg-slate-700'
                } transition-colors duration-300`} />
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  currentStep === 'link' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-110' : storeLink ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {storeLink ? '✓' : '3'}
                </div>
              </div>
            </div>

            {/* Current step input */}
            <div className="max-w-md mx-auto">
              <label className="block text-xl font-semibold text-white mb-3">
                {getStepLabel(currentStep)}
                {isStepRequired(currentStep) && <span className="text-red-400 ml-1">*</span>}
              </label>
              <input
                ref={inputRef}
                type={getStepType(currentStep)}
                value={getStepValue(currentStep)}
                onChange={(e) => {
                  setStepValue(currentStep, e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => handleKeyPress(e, currentStep)}
                required={isStepRequired(currentStep)}
                className="w-full px-6 py-4 text-lg border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-800/50 text-white placeholder:text-slate-500 backdrop-blur-sm transition-all duration-200"
                placeholder={getStepPlaceholder(currentStep)}
              />
              
              {/* Helper text */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  {currentStep === 'name' && 'Press Enter to continue'}
                  {currentStep === 'email' && 'Press Enter to continue (or skip)'}
                  {currentStep === 'link' && 'Press Enter to continue (or skip)'}
                </p>
                {currentStep !== 'name' && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Advanced step */}
        {currentStep === 'advanced' && useAdvanced && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Custom Questions</h3>
              <button
                type="button"
                onClick={() => setCurrentStep('link')}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
            </div>
            {questions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-4">No custom questions added yet.</p>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  + Add Question
                </button>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors"
                  >
                    Skip & Create Presentation
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="p-4 border border-slate-700 rounded-xl space-y-3 bg-slate-800/30">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-white">Question {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="text-red-400 hover:text-red-300 text-sm transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={question.questionText}
                      onChange={(e) => updateQuestion(index, { questionText: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none"
                      placeholder="Enter your question"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={question.questionType}
                        onChange={(e) => updateQuestion(index, { questionType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-800/50 text-white focus:outline-none"
                      >
                        <option value="text">Text</option>
                        <option value="yes_no">Yes/No</option>
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="rating">Rating</option>
                      </select>
                      <input
                        type="number"
                        value={question.position || index + 1}
                        onChange={(e) => updateQuestion(index, { position: parseInt(e.target.value) || 1 })}
                        min="1"
                        className="w-full px-3 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-800/50 text-white focus:outline-none"
                        placeholder="Position"
                      />
                    </div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={question.isRequired || false}
                        onChange={(e) => updateQuestion(index, { isRequired: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 border-slate-600 rounded bg-slate-800 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-300">Required</span>
                    </label>
                  </div>
                ))}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                  >
                    + Add Another Question
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors"
                  >
                    Create Presentation
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {currentStep === 'complete' && loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-slate-400">Creating your presentation...</p>
          </div>
        )}
      </form>
    </div>
  );
}

