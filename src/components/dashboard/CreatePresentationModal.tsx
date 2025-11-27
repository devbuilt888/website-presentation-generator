'use client';

import { useState } from 'react';
import Link from 'next/link';
import { presentations } from '@/data/presentations';
import { getAssetUrl } from '@/config/assets';
import { useTranslations } from 'next-intl';

interface CreatePresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  templates: any[];
}

export default function CreatePresentationModal({
  isOpen,
  onClose,
  onSelectTemplate,
  templates,
}: CreatePresentationModalProps) {
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const t = useTranslations();

  if (!isOpen) return null;

  const handleCardClick = (templateId: string, e: React.MouseEvent) => {
    // If clicking on preview button, don't select template
    if ((e.target as HTMLElement).closest('.preview-button')) {
      return;
    }
    onSelectTemplate(templateId);
    onClose();
  };

  const handlePreviewClick = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setPreviewingId(templateId);
    window.open(`/presentations/${templateId}`, '_blank');
  };

  // Check if template is a tutorial (exclude from normal list)
  const isTutorial = (templateId: string) => {
    return templateId === 'super-presentation-pro' || templateId === 'forest-night-journey';
  };

  // Filter out tutorial templates from normal list
  const normalTemplates = templates.filter(t => !isTutorial(t.id));

  // Handle tutorial card click - randomly go to one of the two presentations
  const handleTutorialClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const randomPresentation = Math.random() < 0.5 ? 'forest-night-journey' : 'super-presentation-pro';
    window.open(`/presentations/${randomPresentation}`, '_blank');
  };

  // Get preview image for template
  const getPreviewImage = (templateId: string) => {
    const previewMap: Record<string, string> = {
      'zinzino-mex': 'assets/presentation-previews/presentation-mx-zino.gif',
      'omega-balance-space': 'assets/presentation-previews/presentation-omega-balance-space.gif',
      'omega-balance': 'assets/presentation-previews/presentation-omega-balance.gif',
      'omega-balance-plus': 'assets/presentation-previews/omega-3-plus.gif',
      'omega-balance-new': 'assets/presentation-previews/omega-3-new.gif',
      'forest-night-journey': 'assets/presentation-previews/forest-journey.gif',
      'super-presentation-pro': 'assets/presentation-previews/super-presentation-pro.gif',
    };
    
    const previewPath = previewMap[templateId];
    if (previewPath) {
      return getAssetUrl(previewPath);
    }
    
    // Fallback to presentation's backgroundGif if available
    const presentation = presentations.find(p => p.id === templateId);
    return presentation?.slides[0]?.backgroundGif || null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-2xl font-bold text-white">{t('dashboard.chooseTemplate')}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Special Tutorial Card - How to use PresenT */}
            <div
              onClick={handleTutorialClick}
              className="group relative rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-br from-amber-900/40 via-amber-800/30 to-amber-900/40 border-amber-700/50 hover:border-amber-500/70 hover:shadow-amber-500/20 hover:bg-gradient-to-br hover:from-amber-900/50 hover:via-amber-800/40 hover:to-amber-900/50"
            >
              {/* Tutorial Tag */}
              <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold rounded-full backdrop-blur-sm border border-amber-400/50 shadow-lg">
                📚 {t('dashboard.tutorial')}
              </div>

              {/* Image/Preview Area */}
              <div className="h-48 relative overflow-hidden bg-gradient-to-br from-amber-600/30 via-amber-500/20 to-amber-600/30">
                {/* Randomly show one of the two preview images */}
                {(() => {
                  const randomGif = Math.random() < 0.5 
                    ? getAssetUrl('assets/presentation-previews/forest-journey.gif')
                    : getAssetUrl('assets/presentation-previews/super-presentation-pro.gif');
                  return (
                    <img
                      src={randomGif}
                      alt="How to use PresenT"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  );
                })()}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 transition-colors group-hover:text-amber-400">
                  How to use PresenT
                </h3>
                <p className="text-sm text-slate-300 line-clamp-2 mb-3">
                  Learn how to create and customize stunning presentations
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Tutorial
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:via-amber-500/5 group-hover:to-amber-500/10 transition-all duration-500 pointer-events-none" />
            </div>

            {/* Normal Template Cards */}
            {normalTemplates.map((template) => {
              const presentation = presentations.find(p => p.id === template.id);
              return (
                <div
                  key={template.id}
                  onClick={(e) => handleCardClick(template.id, e)}
                  className="group relative rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 hover:border-indigo-500/50 hover:shadow-indigo-500/20 hover:bg-gradient-to-br hover:from-slate-800/70 hover:to-slate-900/70"
                >
                  {/* Preview Button */}
                  <button
                    onClick={(e) => handlePreviewClick(e, template.id)}
                    className="preview-button absolute top-3 right-3 z-10 px-3 py-1.5 bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-semibold rounded-full backdrop-blur-sm border border-indigo-400/50 shadow-lg hover:shadow-indigo-500/50 transition-all duration-200"
                  >
                    👁️ {t('common.preview')}
                  </button>

                  {/* Image/Preview Area */}
                  <div className="h-48 relative overflow-hidden bg-gradient-to-br from-indigo-600/20 to-purple-600/20">
                    {getPreviewImage(template.id) ? (
                      <img
                        src={getPreviewImage(template.id)!}
                        alt={template.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = target.nextElementSibling as HTMLElement;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full flex items-center justify-center ${getPreviewImage(template.id) ? 'hidden' : ''}`}
                    >
                      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        {template.name.charAt(0)}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 transition-colors group-hover:text-indigo-400">
                      {template.name}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                      {template.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {presentation?.slides?.length || 0} {t('dashboard.slides')}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/10 group-hover:via-indigo-500/5 group-hover:to-indigo-500/10 transition-all duration-500 pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

