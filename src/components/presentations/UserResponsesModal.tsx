'use client';

import { useState, useEffect } from 'react';
import { getUserResponses, getStoreLinkClicks } from '@/lib/services/instances';
import { X } from 'lucide-react';

interface UserResponsesModalProps {
  instanceId: string;
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string | null;
}

interface UserResponse {
  question: string;
  answer: string | { [key: string]: any };
  answered_at: string;
}

interface StoreLinkClick {
  store_link: string;
  slide_id: string | null;
  clicked_at: string;
}

export default function UserResponsesModal({
  instanceId,
  isOpen,
  onClose,
  recipientName,
}: UserResponsesModalProps) {
  const [responses, setResponses] = useState<Record<string, UserResponse>>({});
  const [storeLinkClicks, setStoreLinkClicks] = useState<StoreLinkClick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && instanceId) {
      loadResponses();
    }
  }, [isOpen, instanceId]);

  const loadResponses = async () => {
    try {
      setLoading(true);
      const [userResponses, clicks] = await Promise.all([
        getUserResponses(instanceId),
        getStoreLinkClicks(instanceId),
      ]);
      setResponses(userResponses as Record<string, UserResponse>);
      setStoreLinkClicks(clicks as StoreLinkClick[]);
    } catch (error) {
      console.error('Failed to load user responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAnswer = (answer: string | { [key: string]: any }): string => {
    if (typeof answer === 'string') {
      return answer;
    }
    if (typeof answer === 'object' && answer !== null) {
      return Object.entries(answer)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
    return String(answer);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-indigo-500/30 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-indigo-500/30 bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white">User Responses</h2>
            {recipientName && (
              <p className="text-sm text-gray-400 mt-1">Recipient: {recipientName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
            </div>
          ) : Object.keys(responses).length === 0 && storeLinkClicks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No responses yet</p>
              <p className="text-gray-500 text-sm mt-2">
                The recipient hasn't provided any answers or clicked any store links yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Responses */}
              {Object.keys(responses).length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Question Responses</h3>
                  <div className="space-y-4">
                    {Object.entries(responses).map(([slideId, response]) => (
                      <div
                        key={slideId}
                        className="bg-slate-800/50 rounded-lg p-4 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">{response.question}</h3>
                          <span className="text-xs text-gray-500 bg-slate-700/50 px-2 py-1 rounded">
                            {slideId}
                          </span>
                        </div>
                        <div className="bg-slate-900/50 rounded p-3 mt-2">
                          <p className="text-indigo-300 font-medium">
                            {formatAnswer(response.answer)}
                          </p>
                        </div>
                        {response.answered_at && (
                          <p className="text-xs text-gray-500 mt-2">
                            Answered: {formatDate(response.answered_at)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Store Link Clicks */}
              {storeLinkClicks.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Store Link Clicks</h3>
                  <div className="space-y-4">
                    {storeLinkClicks.map((click, index) => (
                      <div
                        key={index}
                        className="bg-slate-800/50 rounded-lg p-4 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">Store Link Clicked</h3>
                          {click.slide_id && (
                            <span className="text-xs text-gray-500 bg-slate-700/50 px-2 py-1 rounded">
                              {click.slide_id}
                            </span>
                          )}
                        </div>
                        <div className="bg-slate-900/50 rounded p-3 mt-2">
                          <a
                            href={click.store_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-300 font-medium hover:text-emerald-200 underline break-all"
                          >
                            {click.store_link}
                          </a>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Clicked: {formatDate(click.clicked_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

