'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { isUserAdmin } from '@/lib/utils/user-roles';
import { getAllUsers } from '@/lib/services/users';
import { getAllPresentations } from '@/lib/services/presentations';
import { getAllInstances } from '@/lib/services/instances';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserInstances } from '@/lib/services/instances';
import { getAllTemplates } from '@/lib/presentations/template-registry';
import CustomizationForm from '@/components/presentations/CustomizationForm';
import BatchImportForm from '@/components/presentations/BatchImportForm';
import CreatePresentationModal from '@/components/dashboard/CreatePresentationModal';
import UserResponsesModal from '@/components/presentations/UserResponsesModal';
import type { BatchImportResult } from '@/lib/services/batch';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}

function AdminContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [presentations, setPresentations] = useState<any[]>([]);
  const [instances, setInstances] = useState<any[]>([]);
  
  // Presentation creation state (same as regular dashboard)
  const [templates, setTemplates] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [selectedRecipientName, setSelectedRecipientName] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      router.push('/dashboard');
      return;
    }

    const admin = await isUserAdmin(user.id);
    setIsAdmin(admin);

    if (!admin) {
      router.push('/dashboard');
      return;
    }

    loadAdminData();
  };

  const loadAdminData = async () => {
    try {
      const [usersData, presentationsData, instancesData, templatesData] = await Promise.all([
        getAllUsers(),
        getAllPresentations(user!.id, true),
        getAllInstances(user!.id, true),
        Promise.resolve(getAllTemplates()),
      ]);

      setUsers(usersData);
      setPresentations(presentationsData);
      setInstances(instancesData);
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = (instanceId: string, token: string) => {
    const link = `${window.location.origin}/view/${token}`;
    setShareLink(link);
    setShowForm(false);
    loadAdminData(); // Reload instances
  };

  const handleBatchImportSuccess = (result: BatchImportResult) => {
    setShowBatchImport(false);
    loadAdminData(); // Reload instances
    alert(`Batch import complete! ${result.succeeded} successful, ${result.failedCount} failed.`);
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

  if (!isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <Link
            href="/editor"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-500 hover:to-indigo-500 text-sm font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 border border-purple-500/50"
          >
            🎨 Presentation Editor
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-slate-400 text-sm mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-white">{users.length}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-slate-400 text-sm mb-2">Total Presentations</h3>
            <p className="text-3xl font-bold text-white">{presentations.length}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-slate-400 text-sm mb-2">Total Instances</h3>
            <p className="text-3xl font-bold text-white">{instances.length}</p>
          </div>
        </div>

        {/* Create Presentation Section - Same as regular dashboard */}
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
            
            {/* Plus Button */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-indigo-500/30 animate-pulse blur-xl" />
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-indigo-400/20 via-purple-400/20 to-indigo-400/20 animate-pulse blur-lg" style={{ animationDelay: '0.5s' }} />
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full border-2 border-indigo-400/30 animate-spin-slow" style={{ animationDuration: '8s' }} />
                <div className="absolute w-28 h-28 rounded-full border border-purple-400/20 animate-spin-slow" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="relative w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl hover:shadow-indigo-500/70 flex items-center justify-center text-white text-4xl font-light hover:scale-110 transition-all duration-300 border-2 border-indigo-400/60 hover:border-indigo-300 group z-10"
              >
                <span className="relative z-10 drop-shadow-lg">+</span>
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

        {/* Share Link Display */}
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

        {/* Batch Import Form */}
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

        {/* Users Table */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">All Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300">Email</th>
                  <th className="text-left py-3 px-4 text-slate-300">Name</th>
                  <th className="text-left py-3 px-4 text-slate-300">Role</th>
                  <th className="text-left py-3 px-4 text-slate-300">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr key={userItem.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-white">{userItem.email}</td>
                    <td className="py-3 px-4 text-slate-300">{userItem.full_name || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        userItem.role === 'admin' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-slate-600 text-slate-200'
                      }`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">
                      {userItem.created_at ? new Date(userItem.created_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Presentations Table */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">All Presentations</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300">Name</th>
                  <th className="text-left py-3 px-4 text-slate-300">Template</th>
                  <th className="text-left py-3 px-4 text-slate-300">Created By</th>
                  <th className="text-left py-3 px-4 text-slate-300">Created</th>
                </tr>
              </thead>
              <tbody>
                {presentations.map((pres) => (
                  <tr key={pres.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-white">{pres.name}</td>
                    <td className="py-3 px-4 text-slate-300">{pres.template_id}</td>
                    <td className="py-3 px-4 text-slate-300">{pres.created_by}</td>
                    <td className="py-3 px-4 text-slate-400 text-sm">
                      {pres.created_at ? new Date(pres.created_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instances Table */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">All Instances</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300">Recipient</th>
                  <th className="text-left py-3 px-4 text-slate-300">Email</th>
                  <th className="text-left py-3 px-4 text-slate-300">Status</th>
                  <th className="text-left py-3 px-4 text-slate-300">Created</th>
                  <th className="text-left py-3 px-4 text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {instances.map((instance) => (
                  <tr key={instance.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-white">{instance.recipient_name || '-'}</td>
                    <td className="py-3 px-4 text-slate-300">{instance.recipient_email || '-'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-slate-600 text-slate-200">
                        {instance.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">
                      {instance.created_at ? new Date(instance.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {(instance.status === 'viewed' || instance.status === 'completed') && (
                        <button
                          onClick={() => {
                            setSelectedInstanceId(instance.id);
                            setSelectedRecipientName(instance.recipient_name);
                          }}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium transition-colors"
                        >
                          View Responses
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Responses Modal */}
        {selectedInstanceId && (
          <UserResponsesModal
            instanceId={selectedInstanceId}
            isOpen={!!selectedInstanceId}
            onClose={() => {
              setSelectedInstanceId(null);
              setSelectedRecipientName(null);
            }}
            recipientName={selectedRecipientName}
          />
        )}
      </div>
    </div>
  );
}

