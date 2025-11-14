/**
 * Reusable Presentation Renderer Component
 * 
 * This component provides a consistent way to render presentations
 * with support for customization and questions.
 */

'use client';

import { useState } from 'react';
import { CustomizedPresentation, QuestionAnswer } from '@/types/presentation';
import PresentationViewer from '../PresentationViewer';
import { Presentation } from '@/data/presentations';

interface PresentationRendererProps {
  presentation: CustomizedPresentation;
  onAnswer?: (answer: QuestionAnswer) => void;
  onComplete?: () => void;
  readOnly?: boolean;
}

export default function PresentationRenderer({
  presentation,
  onAnswer,
  onComplete,
  readOnly = false,
}: PresentationRendererProps) {
  const [answers, setAnswers] = useState<QuestionAnswer[]>(presentation.answers || []);
  
  // Convert CustomizedPresentation to Presentation format for PresentationViewer
  const presentationData: Presentation = {
    id: presentation.instanceId || presentation.presentationId,
    name: presentation.template.name,
    description: presentation.template.description,
    slides: presentation.template.slides.map((slide) => ({
      ...slide,
      // Ensure all required fields are present
      id: slide.id,
      type: slide.type,
      duration: slide.duration || 5000,
    })),
  };
  
  const handleAnswer = (questionId: string, answer: string | any) => {
    const newAnswer: QuestionAnswer = {
      questionId,
      answerText: typeof answer === 'string' ? answer : undefined,
      answerValue: typeof answer !== 'string' ? answer : undefined,
      answeredAt: new Date().toISOString(),
    };
    
    const updatedAnswers = [...answers.filter(a => a.questionId !== questionId), newAnswer];
    setAnswers(updatedAnswers);
    
    if (onAnswer) {
      onAnswer(newAnswer);
    }
  };
  
  return (
    <PresentationViewer 
      presentation={presentationData}
      // Add answer handler if needed
      // This would require extending PresentationViewer to support questions
    />
  );
}

