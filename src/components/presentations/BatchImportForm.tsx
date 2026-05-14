'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getAllTemplates } from '@/lib/presentations/template-registry';
import { 
  createBatchInstances, 
  parseCSV, 
  validateContact,
  type ContactRow,
  type BatchImportResult 
} from '@/lib/services/batch';
import { useTranslations } from 'next-intl';

interface BatchImportFormProps {
  onSuccess?: (result: BatchImportResult) => void;
  onCancel?: () => void;
  onToast?: (message: string) => void;
}

export default function BatchImportForm({ onSuccess, onCancel, onToast }: BatchImportFormProps) {
  const { user } = useAuth();
  const t = useTranslations('batchImport');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload');
  const [inputMethod, setInputMethod] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [batchText, setBatchText] = useState<string>('');
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [defaultStoreLink, setDefaultStoreLink] = useState<string>('');
  const [useEmail, setUseEmail] = useState<boolean>(true);
  const [useSameLink, setUseSameLink] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<BatchImportResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({});

  const templates = getAllTemplates();

  // Parse batch text input
  const parseBatchText = (text: string): ContactRow[] => {
    const contacts: ContactRow[] = [];
    const lines = text.split(',').map(item => item.trim()).filter(item => item);
    
    if (lines.length === 0) return [];
    
    // If email is enabled, expect pairs: name, email, name, email...
    // If email is disabled, expect just names: name, name, name...
    if (useEmail) {
      // Parse pairs: name, email, name, email...
      for (let i = 0; i < lines.length; i += 2) {
        const name = lines[i];
        const email = lines[i + 1] || '';
        
        if (!name) continue;
        
        const contact: ContactRow = { name };
        
        // Validate email if provided
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          contact.email = email;
        } else if (email) {
          // Invalid email format, but we'll still create the contact
          contact.email = email;
        }
        
        // Add store link if using same link for all
        if (useSameLink && defaultStoreLink) {
          contact.storeLink = defaultStoreLink;
        }
        
        contacts.push(contact);
      }
    } else {
      // Parse just names: name, name, name...
      for (const name of lines) {
        if (!name) continue;
        
        const contact: ContactRow = { name };
        
        // Add store link if using same link for all
        if (useSameLink && defaultStoreLink) {
          contact.storeLink = defaultStoreLink;
        }
        
        contacts.push(contact);
      }
    }
    
    return contacts;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError('');

    // Validate file type
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setError(t('errorWrongFile'));
      return;
    }

    try {
      const content = await file.text();
      const parsedContacts = parseCSV(content);
      
      if (parsedContacts.length === 0) {
        setError(t('errorNoContactsFile'));
        return;
      }

      // Validate all contacts
      const errors: Record<number, string[]> = {};
      parsedContacts.forEach((contact, index) => {
        const validation = validateContact(contact);
        if (!validation.valid) {
          errors[index] = validation.errors;
        }
      });

      setValidationErrors(errors);
      setContacts(parsedContacts);
      setStep('preview');
    } catch (err: any) {
      setError(err.message || t('errorParseCsv'));
    }
  };

  const handleBatchTextChange = (text: string) => {
    setBatchText(text);
    setError('');
    
    if (!text.trim()) {
      setContacts([]);
      return;
    }

    try {
      const parsedContacts = parseBatchText(text);
      
      if (parsedContacts.length === 0) {
        setError(t('errorNoContactsFormat'));
        setContacts([]);
        return;
      }

      // Validate all contacts
      const errors: Record<number, string[]> = {};
      parsedContacts.forEach((contact, index) => {
        const validation = validateContact(contact);
        if (!validation.valid) {
          errors[index] = validation.errors;
        }
      });

      setValidationErrors(errors);
      setContacts(parsedContacts);
    } catch (err: any) {
      setError(err.message || t('errorParseContacts'));
    }
  };

  const handleTextInputPreview = () => {
    if (!batchText.trim()) {
      setError(t('errorEnterContacts'));
      return;
    }

    const parsedContacts = parseBatchText(batchText);
    
    if (parsedContacts.length === 0) {
      setError(t('errorNoContactsFormat'));
      return;
    }

    // Validate all contacts
    const errors: Record<number, string[]> = {};
    parsedContacts.forEach((contact, index) => {
      const validation = validateContact(contact);
      if (!validation.valid) {
        errors[index] = validation.errors;
      }
    });

    setValidationErrors(errors);
    setContacts(parsedContacts);
    setStep('preview');
  };

  const handleImport = async () => {
    if (!user || !selectedTemplate) {
      setError(t('errorSelectTemplate'));
      return;
    }

    setStep('processing');
    setError('');

    try {
      const importResult = await createBatchInstances({
        templateId: selectedTemplate,
        userId: user.id,
        contacts,
        defaultStoreLink: defaultStoreLink || undefined,
        customizationLevel: 'simple',
      });

      setResult(importResult);
      setStep('complete');
      
      if (onSuccess) {
        onSuccess(importResult);
      }
    } catch (err: any) {
      setError(err.message || t('errorImportFailed'));
      setStep('preview');
    }
  };

  const getShareLink = (token: string) => {
    return `${window.location.origin}/view/${token}`;
  };

  const downloadResults = () => {
    if (!result) return;

    const csvLines = [
      t('csvHeader'),
      ...result.success.map(instance => 
        `"${instance.recipient_name || ''}","${instance.recipient_email || ''}","${instance.store_link || ''}","${getShareLink(instance.share_token)}","${t('csvSuccess')}",""`
      ),
      ...result.failed.map(f => 
        `"${f.contact.name}","${f.contact.email || ''}","${f.contact.storeLink || ''}","","${t('csvFailed')}","${f.error}"`
      ),
    ];

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch-import-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t('title')}</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg backdrop-blur-sm">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Step 1: Upload or Text Input */}
      {step === 'upload' && (
        <div>
          {/* Input Method Toggle */}
          <div className="mb-6 flex gap-4">
            <button
              type="button"
              onClick={() => {
                setInputMethod('file');
                setBatchText('');
                setContacts([]);
                setError('');
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                inputMethod === 'file'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              📁 {t('uploadCsv')}
            </button>
            <button
              type="button"
              onClick={() => {
                setInputMethod('text');
                setSelectedFile(null);
                setContacts([]);
                setError('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                inputMethod === 'text'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              ✏️ {t('textInput')}
            </button>
          </div>

          {inputMethod === 'file' ? (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('uploadCsvFile')}
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  {t('csvColumnsHint')}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">{t('csvExampleTitle')}</h3>
                <pre className="text-sm text-blue-800">
{`name,email,store link
John Doe,john@example.com,https://store.com/john
Jane Smith,jane@example.com,https://store.com/jane
Bob Johnson,bob@example.com,`}
                </pre>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {/* Column Toggles */}
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">{t('name')}</span>
                  <span className="px-2 py-1 bg-emerald-600/30 text-emerald-300 text-xs rounded border border-emerald-500/50">
                    {t('required')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setUseEmail(!useEmail)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    useEmail
                      ? 'bg-indigo-600 text-white border border-indigo-400/50'
                      : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'
                  }`}
                >
                  {useEmail ? '✓' : ''} {t('email')}
                </button>
              </div>

              {/* Store Link Options */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => setUseSameLink(!useSameLink)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      useSameLink
                        ? 'bg-indigo-600 text-white border border-indigo-400/50'
                        : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'
                    }`}
                  >
                    {useSameLink ? '✓' : ''} {t('sameLinkForAll')}
                  </button>
                  {useSameLink && (
                    <input
                      type="url"
                      value={defaultStoreLink}
                      onChange={(e) => setDefaultStoreLink(e.target.value)}
                      placeholder="https://store.com"
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {useEmail ? t('enterContactsPairs') : t('enterContactsNames')}
                </label>
                <textarea
                  value={batchText}
                  onChange={(e) => handleBatchTextChange(e.target.value)}
                  placeholder={
                    useEmail
                      ? 'John Doe, johndoe@example.com, Martha Steward, martha@test.com, Oprah Winfrey, oprah@test.com'
                      : 'John Doe, Martha Steward, Oprah Winfrey'
                  }
                  className="w-full h-40 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <p className="text-xs text-slate-400 mt-2">
                  {useEmail ? t('hintPairs') : t('hintNames')}
                </p>
                {contacts.length > 0 && (
                  <p className="text-xs text-emerald-400 mt-1">
                    ✓ {t('contactsDetected', { count: contacts.length })}
                  </p>
                )}
              </div>

              {/* Preview Button */}
              {contacts.length > 0 && (
                <button
                  onClick={handleTextInputPreview}
                  className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors"
                >
                  {t('previewButton', { count: contacts.length })}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Preview */}
      {step === 'preview' && (
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('previewNContacts', { count: contacts.length })}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                {t('selectTemplate')}
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">{t('chooseTemplate')}</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {!useSameLink && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">
                  {t('defaultStoreLink')}
                </label>
                <input
                  type="url"
                  value={defaultStoreLink}
                  onChange={(e) => setDefaultStoreLink(e.target.value)}
                  placeholder="https://store.com"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  {t('defaultStoreLinkHint')}
                </p>
              </div>
            )}

            <div className="max-h-96 overflow-y-auto border border-slate-700 rounded-lg">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">{t('name')}</th>
                    {useEmail && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">{t('email')}</th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">{t('colStoreLink')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">{t('colStatus')}</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-900/30 divide-y divide-slate-700">
                  {contacts.map((contact, index) => {
                    const errors = validationErrors[index] || [];
                    return (
                      <tr key={index} className={errors.length > 0 ? 'bg-red-900/20' : 'hover:bg-slate-800/30'}>
                        <td className="px-4 py-3 text-sm text-white">{contact.name}</td>
                        {useEmail && (
                          <td className="px-4 py-3 text-sm text-slate-300">{contact.email || '-'}</td>
                        )}
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {contact.storeLink || defaultStoreLink || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {errors.length > 0 ? (
                            <span className="text-red-400" title={errors.join(', ')}>
                              ⚠️ {errors[0]}
                            </span>
                          ) : (
                            <span className="text-emerald-400">{t('valid')}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setStep('upload');
                setContacts([]);
                setSelectedFile(null);
                setBatchText('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
              {t('back')}
            </button>
            <button
              onClick={handleImport}
              disabled={!selectedTemplate || contacts.length === 0}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('importN', { count: contacts.length })}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Processing */}
      {step === 'processing' && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-300">{t('processing')}</p>
          <p className="text-sm text-slate-400 mt-2">{t('processingWait')}</p>
        </div>
      )}

      {/* Step 4: Complete */}
      {step === 'complete' && result && (
        <div>
          <div className={`mb-6 p-4 rounded-lg backdrop-blur-sm ${
            result.failedCount === 0 
              ? 'bg-emerald-900/30 border border-emerald-700/50' 
              : 'bg-yellow-900/30 border border-yellow-700/50'
          }`}>
            <h3 className="font-semibold mb-2 text-white">
              {t('importComplete')}
            </h3>
            <p className="text-sm text-slate-300">
              {t('importSummary', { succeeded: result.succeeded, failedCount: result.failedCount })}
            </p>
          </div>

          {result.success.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-white mb-3">{t('successfulImports', { count: result.success.length })}</h4>
              <div className="max-h-64 overflow-y-auto border border-slate-700 rounded-lg">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-300">{t('name')}</th>
                      {useEmail && (
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-300">{t('email')}</th>
                      )}
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-300">{t('colShareLink')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-900/30 divide-y divide-slate-700">
                    {result.success.map((instance) => (
                      <tr key={instance.id} className="hover:bg-slate-800/30">
                        <td className="px-4 py-2 text-sm text-white">{instance.recipient_name}</td>
                        {useEmail && (
                          <td className="px-4 py-2 text-sm text-slate-300">{instance.recipient_email || '-'}</td>
                        )}
                        <td className="px-4 py-2 text-sm">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(getShareLink(instance.share_token));
                              if (onToast) {
                                onToast(t('shareLinkCopied'));
                              }
                            }}
                            className="text-indigo-400 hover:text-indigo-300 text-xs transition-colors"
                          >
                            {t('copyLink')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {result.failed.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-white mb-3">{t('failedImports', { count: result.failed.length })}</h4>
              <div className="max-h-64 overflow-y-auto border border-slate-700 rounded-lg">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-300">{t('name')}</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-300">{t('colError')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-900/30 divide-y divide-slate-700">
                    {result.failed.map((f, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="px-4 py-2 text-sm text-white">{f.contact.name}</td>
                        <td className="px-4 py-2 text-sm text-red-400">{f.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={downloadResults}
              className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
              {t('downloadCsv')}
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
              >
                {t('done')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

