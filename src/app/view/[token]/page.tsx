'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getInstanceByToken } from '@/lib/services/instances';
import { getPresentation } from '@/lib/services/presentations';
import { getTemplate } from '@/lib/presentations/template-registry';
import { applySimpleCustomization } from '@/lib/presentations/customization';
import { getInstanceQuestions, getInstanceAnswers } from '@/lib/services/questions';
import PresentationViewer from '@/components/PresentationViewer';
import ThreeDPresentationViewer from '@/components/ThreeDPresentationViewer';
import ForestPresentationViewer from '@/components/ForestPresentationViewer';
import OmegaBalancePresentationViewer from '@/components/OmegaBalancePresentationViewer';
import { Presentation } from '@/data/presentations';
import { markInstanceAsViewed } from '@/lib/services/instances';

export default function ViewPresentationPage() {
  const params = useParams();
  const token = params.token as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [templateId, setTemplateId] = useState<string>('');

  useEffect(() => {
    loadPresentation();
  }, [token]);

  const loadPresentation = async () => {
    try {
      // Get instance
      const instance = await getInstanceByToken(token);
      
      // Mark as viewed
      if (instance.status !== 'viewed' && instance.status !== 'completed') {
        await markInstanceAsViewed(instance.id);
      }

      // Get the presentation record to get the template_id
      const presentationRecord = await getPresentation(instance.presentation_id);
      
      // Store the template ID for viewer selection
      setTemplateId(presentationRecord.template_id);
      
      // Get template using the template_id from the presentation
      const template = getTemplate(presentationRecord.template_id);
      if (!template) {
        throw new Error('Template not found');
      }

      // Apply customization
      const customized = applySimpleCustomization(template, {
        recipientName: instance.recipient_name || '',
        storeLink: instance.store_link || '',
        ...(instance.custom_fields as any || {}),
      });

      // Get questions and answers if advanced
      let questions: any[] = [];
      let answers: any[] = [];
      
      if (instance.customization_level === 'advanced') {
        questions = await getInstanceQuestions(instance.id);
        answers = await getInstanceAnswers(instance.id);
      }

      // Convert to Presentation format
      const presentationData: Presentation = {
        id: presentationRecord.template_id, // Use template_id so viewers can identify which to use
        title: customized.name,
        description: customized.description,
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
      setError(err.message || 'Failed to load presentation');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Presentation Not Found</h1>
          <p className="text-gray-400">{error || 'The presentation you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  // Render the appropriate viewer based on template ID
  if (templateId === 'super-presentation-pro') {
    return <ThreeDPresentationViewer presentation={presentation} />;
  }
  
  if (templateId === 'forest-night-journey') {
    return <ForestPresentationViewer presentation={presentation} />;
  }
  
  if (templateId === 'omega-balance') {
    return <OmegaBalancePresentationViewer presentation={presentation} />;
  }
  
  // Default to standard viewer for zinzino-mex and others
  return <PresentationViewer presentation={presentation} />;
}

