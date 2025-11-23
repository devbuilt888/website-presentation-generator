'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUserInstances } from '@/lib/services/instances';
import { getAllTemplates } from '@/lib/presentations/template-registry';
import CustomizationForm from '@/components/presentations/CustomizationForm';
import BatchImportForm from '@/components/presentations/BatchImportForm';
import CreatePresentationModal from '@/components/dashboard/CreatePresentationModal';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { presentations } from '@/data/presentations';
import type { BatchImportResult } from '@/lib/services/batch';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [instances, setInstances] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [instancesData, templatesData] = await Promise.all([
        getUserInstances(user.id),
        Promise.resolve(getAllTemplates()),
      ]);

      setInstances(instancesData || []);
      setTemplates(templatesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = (instanceId: string, token: string) => {
    const link = `${window.location.origin}/view/${token}`;
    setShareLink(link);
    setShowForm(false);
    loadData(); // Reload instances
  };

  const handleBatchImportSuccess = (result: BatchImportResult) => {
    setShowBatchImport(false);
    loadData(); // Reload instances
    alert(`Batch import complete! ${result.succeeded} successful, ${result.failedCount} failed.`);
  };

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/view/${token}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowForm(true);
    setShowCreateModal(false);
    setShareLink(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Center Create Button - Hidden when form or batch import is open */}
        {!showForm && !showBatchImport && (
          <div className="flex flex-col items-center mb-12 relative">
          {/* Tooltip with Arrow */}
          <div className="mb-4 flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-800/90 backdrop-blur-sm text-white text-sm rounded-lg shadow-xl border border-slate-700/50">
              Click to create a new presentation
            </div>
            <div className="relative">
              <svg className="w-8 h-8 text-indigo-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
          
          {/* Plus Button with Enhanced Glow */}
          <div className="relative">
            {/* Outer Glow Ring - Pulsing */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-indigo-500/30 animate-pulse blur-xl" />
              <div className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-indigo-400/20 via-purple-400/20 to-indigo-400/20 animate-pulse blur-lg" style={{ animationDelay: '0.5s' }} />
            </div>
            
            {/* Animated Background Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-24 h-24 rounded-full border-2 border-indigo-400/30 animate-spin-slow" style={{ animationDuration: '8s' }} />
              <div className="absolute w-28 h-28 rounded-full border border-purple-400/20 animate-spin-slow" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
            </div>
            
            {/* Main Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="relative w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl hover:shadow-indigo-500/70 flex items-center justify-center text-white text-4xl font-light hover:scale-110 transition-all duration-300 border-2 border-indigo-400/60 hover:border-indigo-300 group z-10"
            >
              <span className="relative z-10 drop-shadow-lg">+</span>
              
              {/* Inner Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
            </button>
          </div>
        </div>
        )}

        {/* Create Presentation Modal */}
        <CreatePresentationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSelectTemplate={handleTemplateSelect}
          templates={templates}
        />

        {shareLink && (
          <div className="mb-6 p-4 bg-emerald-900/30 border border-emerald-700/50 rounded-xl backdrop-blur-sm">
            <p className="text-emerald-300 font-medium mb-2">Presentation created successfully!</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 border border-emerald-700/50 rounded-lg bg-slate-800/50 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  alert('Link copied!');
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 text-sm transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Batch Import */}
        {showBatchImport && (
          <div className="mb-8">
            <BatchImportForm
              onSuccess={handleBatchImportSuccess}
              onCancel={() => setShowBatchImport(false)}
            />
          </div>
        )}

        {/* Customization Form */}
        {showForm && selectedTemplate && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Customize Presentation</h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedTemplate(null);
                    setShareLink(null);
                  }}
                  className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <CustomizationForm
                templateId={selectedTemplate}
                onSuccess={handleFormSuccess}
              />
            </div>
          </div>
        )}

        {/* Batch Import Button */}
        {!showForm && !showBatchImport && (
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => setShowBatchImport(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-500 hover:to-teal-500 text-sm font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 border border-emerald-500/50"
            >
              📥 Batch Import Contacts
            </button>
          </div>
        )}

        {/* Sent Presentations */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Your Presentations</h2>
          {instances.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center border border-indigo-500/30">
                <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-400 mb-2">No presentations created yet</p>
              <p className="text-slate-500 text-sm">Click the + button to create your first presentation</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {instances.map((instance) => {
                const link = `${window.location.origin}/view/${instance.share_token}`;
                const statusColors = {
                  draft: 'bg-slate-600',
                  sent: 'bg-blue-600',
                  viewed: 'bg-indigo-600',
                  completed: 'bg-emerald-600',
                };
                return (
                  <div
                    key={instance.id}
                    className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-slate-700/50 hover:border-indigo-500/50 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white text-lg">
                            {instance.recipient_name || 'Unnamed Recipient'}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${
                              statusColors[instance.status as keyof typeof statusColors] || 'bg-slate-600'
                            }`}
                          >
                            {instance.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">
                          {instance.recipient_email || 'No email'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>
                            {instance.sent_at
                              ? new Date(instance.sent_at).toLocaleDateString()
                              : 'Not sent'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyLink(instance.share_token)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors border border-indigo-500/50"
                        >
                          Copy Link
                        </button>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors border border-slate-600/50"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

