'use client';

import { useState } from 'react';
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

export default function CustomizationForm({ templateId, onSuccess }: CustomizationFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Simple customization fields
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [storeLink, setStoreLink] = useState('');
  
  // Advanced customization
  const [useAdvanced, setUseAdvanced] = useState(false);
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Simple Customization */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Recipient Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Name *
          </label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="e.g., John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Email
          </label>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="recipient@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store/Product Link
          </label>
          <input
            type="url"
            value={storeLink}
            onChange={(e) => setStoreLink(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="https://yourstore.com"
          />
        </div>
      </div>

      {/* Advanced Customization Toggle */}
      <div className="border-t pt-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={useAdvanced}
            onChange={(e) => setUseAdvanced(e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Add Custom Questions (Advanced)
          </span>
        </label>
      </div>

      {/* Advanced Questions */}
      {useAdvanced && (
        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Custom Questions</h3>
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              + Add Question
            </button>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-gray-700">Question {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text
                </label>
                <input
                  type="text"
                  value={question.questionText}
                  onChange={(e) => updateQuestion(index, { questionText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  placeholder="Enter your question"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={question.questionType}
                    onChange={(e) => updateQuestion(index, { questionType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="text">Text</option>
                    <option value="yes_no">Yes/No</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slide Position
                  </label>
                  <input
                    type="number"
                    value={question.position || index + 1}
                    onChange={(e) => updateQuestion(index, { position: parseInt(e.target.value) || 1 })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={question.isRequired || false}
                  onChange={(e) => updateQuestion(index, { isRequired: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Required</span>
              </label>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create & Send Presentation'}
        </button>
      </div>
    </form>
  );
}

