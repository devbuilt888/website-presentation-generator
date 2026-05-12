'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getTemplate } from '@/lib/presentations/template-registry';
import { createCustomizedPresentation } from '@/lib/presentations/customization';
import { createInstance } from '@/lib/services/instances';
import { createPresentation } from '@/lib/services/presentations';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase/client';

interface CustomizationFormProps {
  templateId: string;
  onSuccess?: (instanceId: string, shareToken: string) => void;
}

type Step = 'name' | 'email' | 'link' | 'complete';

export default function CustomizationForm({ templateId, onSuccess }: CustomizationFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [storeLink, setStoreLink] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>('name');

  useEffect(() => {
    if (inputRef.current && currentStep !== 'complete') {
      inputRef.current.focus();
    }
  }, [currentStep]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, step: Step) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNextStep(step);
    }
  };

  const handleNextStep = (current: Step) => {
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

    switch (current) {
      case 'name':
        setCurrentStep('email');
        break;
      case 'email':
        setCurrentStep('link');
        break;
      case 'link':
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
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    setCurrentStep('complete');

    try {
      if (!user) throw new Error('Not authenticated');

      const template = getTemplate(templateId);
      if (!template) throw new Error('Template not found');

      const customized = createCustomizedPresentation(template, {
        level: 'simple',
        simple: {
          recipientName,
          storeLink,
        },
      });

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
        if (
          err.message?.includes('foreign key constraint') ||
          err.message?.includes('presentations_created_by_fkey')
        ) {
          throw new Error(
            'User profile not found. Please try logging out and logging back in. If the problem persists, contact support.'
          );
        }
        throw err;
      }

      const instance = await createInstance({
        presentation_id: presentation.id,
        created_by: user.id,
        recipient_name: recipientName || null,
        recipient_email: recipientEmail || null,
        store_link: storeLink || null,
        customization_level: 'simple',
        custom_fields: customized.customization.simple as any,
        status: 'draft',
      });

      const { error: updateError } = await supabase
        .from('presentation_instances')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', instance.id);

      if (updateError) {
        throw new Error(`Failed to update presentation status: ${updateError.message}`);
      }

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
      case 'name':
        return 'Recipient Name';
      case 'email':
        return 'Recipient Email';
      case 'link':
        return 'Store/Product Link';
      default:
        return '';
    }
  };

  const getStepPlaceholder = (step: Step) => {
    switch (step) {
      case 'name':
        return 'e.g., John Doe';
      case 'email':
        return 'recipient@example.com (optional)';
      case 'link':
        return 'https://yourstore.com (optional)';
      default:
        return '';
    }
  };

  const getStepValue = (step: Step) => {
    switch (step) {
      case 'name':
        return recipientName;
      case 'email':
        return recipientEmail;
      case 'link':
        return storeLink;
      default:
        return '';
    }
  };

  const setStepValue = (step: Step, value: string) => {
    switch (step) {
      case 'name':
        setRecipientName(value);
        break;
      case 'email':
        setRecipientEmail(value);
        break;
      case 'link':
        setStoreLink(value);
        break;
    }
  };

  const getStepType = (step: Step) => {
    switch (step) {
      case 'name':
        return 'text';
      case 'email':
        return 'email';
      case 'link':
        return 'url';
      default:
        return 'text';
    }
  };

  const isStepRequired = (step: Step) => {
    return step === 'name';
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-red-300 backdrop-blur-sm">
            {error}
          </div>
        )}

        {currentStep !== 'complete' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentStep === 'name'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-110'
                      : recipientName
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {recipientName ? '✓' : '1'}
                </div>
                <div
                  className={`w-1 h-8 ${
                    recipientName ? 'bg-emerald-600' : 'bg-slate-700'
                  } transition-colors duration-300`}
                />
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentStep === 'email'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-110'
                      : recipientEmail
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {recipientEmail ? '✓' : '2'}
                </div>
                <div
                  className={`w-1 h-8 ${
                    recipientEmail ? 'bg-emerald-600' : 'bg-slate-700'
                  } transition-colors duration-300`}
                />
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentStep === 'link'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-110'
                      : storeLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {storeLink ? '✓' : '3'}
                </div>
              </div>
            </div>

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
