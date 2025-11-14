'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUserInstances } from '@/lib/services/instances';
import { getAllTemplates } from '@/lib/presentations/template-registry';
import CustomizationForm from '@/components/presentations/CustomizationForm';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { presentations } from '@/data/presentations';

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

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/view/${token}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {shareLink && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium mb-2">Presentation created successfully!</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 border border-green-300 rounded bg-white text-sm text-gray-900"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  alert('Link copied!');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Preview Templates Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Preview Templates</h2>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showPreview ? 'Hide Previews' : 'Show Previews'}
            </button>
          </div>
          
          {showPreview && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {presentations.map((presentation) => (
                <div
                  key={presentation.id}
                  className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                    {presentation.slides[0]?.backgroundGif ? (
                      <img 
                        src={presentation.slides[0].backgroundGif} 
                        alt={presentation.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white text-center">
                        <h3 className="text-2xl font-bold mb-2">
                          {presentation.title}
                        </h3>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">Preview</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{presentation.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{presentation.description}</p>
                    <p className="text-xs text-gray-500 mb-3">{presentation.slides.length} slides</p>
                    <Link
                      href={`/presentations/${presentation.id}`}
                      target="_blank"
                      className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      View Preview
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create New Presentation */}
        {!showForm ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Presentation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setShowForm(true);
                    setShareLink(null);
                  }}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description || 'No description'}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Customize Presentation</h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedTemplate(null);
                    setShareLink(null);
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
              {selectedTemplate && (
                <CustomizationForm
                  templateId={selectedTemplate}
                  onSuccess={handleFormSuccess}
                />
              )}
            </div>
          </div>
        )}

        {/* Sent Presentations */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sent Presentations</h2>
          {instances.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No presentations sent yet. Create one above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {instances.map((instance) => {
                const link = `${window.location.origin}/view/${instance.share_token}`;
                return (
                  <div key={instance.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {instance.recipient_name || 'Unnamed Recipient'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {instance.recipient_email || 'No email'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Status: {instance.status}</span>
                          <span>•</span>
                          <span>
                            {instance.sent_at
                              ? new Date(instance.sent_at).toLocaleDateString()
                              : 'Not sent'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => copyLink(instance.share_token)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Copy Link
                        </button>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm text-center"
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

