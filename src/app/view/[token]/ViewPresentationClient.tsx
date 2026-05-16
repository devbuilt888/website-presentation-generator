'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getInstanceByToken, markInstanceAsViewed } from '@/lib/services/instances';
import { resolveViewerContactPhone } from '@/lib/utils/contact-phone';
import { getTemplate } from '@/lib/presentations/template-registry';
import { applySimpleCustomization } from '@/lib/presentations/customization';
import { getInstanceQuestions, getInstanceAnswers } from '@/lib/services/questions';
import PresentationViewer from '@/components/PresentationViewer';
import ThreeDPresentationViewer from '@/components/ThreeDPresentationViewer';
import ForestPresentationViewer from '@/components/ForestPresentationViewer';
import OmegaBalancePresentationViewer from '@/components/OmegaBalancePresentationViewer';
import OmegaBalanceSpacePresentationViewer from '@/components/OmegaBalanceSpacePresentationViewer';
import OmegaBalancePlusPresentationViewer from '@/components/OmegaBalancePlusPresentationViewer';
import OmegaBalanceNewPresentationViewer from '@/components/OmegaBalanceNewPresentationViewer';
import { Presentation } from '@/data/presentations';

export default function ViewPresentationClient() {
  const params = useParams();
  const token = params.token as string;
  const t = useTranslations('viewPresentation');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [templateId, setTemplateId] = useState<string>('');
  const [instanceId, setInstanceId] = useState<string>('');

  useEffect(() => {
    loadPresentation();
  }, [token]);

  const loadPresentation = async () => {
    try {
      const instance: any = await getInstanceByToken(token);

      setInstanceId(instance.id);

      if (instance.status !== 'viewed' && instance.status !== 'completed') {
        await markInstanceAsViewed(instance.id);
      }

      const templateIdFromDb = instance.presentation?.template_id;
      if (!templateIdFromDb) {
        throw new Error(t('templateIdMissing'));
      }

      setTemplateId(templateIdFromDb);

      const template = getTemplate(templateIdFromDb);
      if (!template) {
        throw new Error(t('templateNotFound'));
      }

      const contactPhone = resolveViewerContactPhone(
        templateIdFromDb,
        instance.store_link,
        null
      );

      const customized = applySimpleCustomization(template, {
        recipientName: instance.recipient_name || '',
        storeLink: contactPhone,
        ...(instance.custom_fields as any || {}),
      });

      let questions: any[] = [];
      let answers: any[] = [];

      if (instance.customization_level === 'advanced') {
        questions = await getInstanceQuestions(instance.id);
        answers = await getInstanceAnswers(instance.id);
      }

      const dbName = instance.presentation?.name?.trim();
      const presentationData: Presentation = {
        id: templateIdFromDb,
        title: dbName || customized.name,
        description: instance.presentation?.description?.trim() || customized.description,
        createdAt: instance.created_at,
        slides: customized.slides.map((slide) => ({
          ...slide,
          id: slide.id,
          type: slide.type,
          duration: slide.duration || 5000,
        })),
      };

      setPresentation(presentationData);
    } catch (err: any) {
      setError(err.message || t('failedLoad'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">{t('notFoundTitle')}</h1>
          <p className="text-gray-400">{error || t('notFoundBody')}</p>
        </div>
      </div>
    );
  }

  if (templateId === 'super-presentation-pro') {
    return <ThreeDPresentationViewer presentation={presentation} instanceId={instanceId} />;
  }

  if (templateId === 'forest-night-journey') {
    return <ForestPresentationViewer presentation={presentation} instanceId={instanceId} />;
  }

  if (templateId === 'omega-balance') {
    return <OmegaBalancePresentationViewer presentation={presentation} instanceId={instanceId} />;
  }

  if (templateId === 'omega-balance-space') {
    return <OmegaBalanceSpacePresentationViewer presentation={presentation} instanceId={instanceId} />;
  }

  if (templateId === 'omega-balance-plus') {
    return <OmegaBalancePlusPresentationViewer presentation={presentation} instanceId={instanceId} />;
  }

  if (templateId === 'omega-balance-new') {
    return <OmegaBalanceNewPresentationViewer presentation={presentation} instanceId={instanceId} />;
  }

  return <PresentationViewer presentation={presentation} instanceId={instanceId} />;
}
