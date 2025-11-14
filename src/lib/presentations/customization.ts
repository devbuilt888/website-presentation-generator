/**
 * Presentation Customization System
 * 
 * Handles two levels of customization:
 * 1. Simple: Basic field replacements (name, store link, etc.)
 * 2. Advanced: Custom questions with answers
 */

import { 
  PresentationTemplate, 
  SimpleCustomization, 
  CustomQuestion,
  QuestionAnswer,
  CustomizedPresentation 
} from '@/types/presentation';

/**
 * Apply simple customization to a presentation template
 */
export function applySimpleCustomization(
  template: PresentationTemplate,
  customization: SimpleCustomization
): PresentationTemplate {
  const customizedSlides = template.slides.map((slide) => {
    const customizedSlide = { ...slide };
    
    // Replace placeholders in text fields
    const replacePlaceholders = (text?: string): string | undefined => {
      if (!text) return text;
      
      let result = text;
      
      // Replace common placeholders
      // Use recipient name or default to "Customer"
      const recipientName = customization.recipientName || 'Customer';
      result = result.replace(/\{\{recipientName\}\}/g, recipientName);
      result = result.replace(/\{\{name\}\}/g, recipientName);
      
      if (customization.storeLink) {
        result = result.replace(/\{\{storeLink\}\}/g, customization.storeLink);
        result = result.replace(/\{\{link\}\}/g, customization.storeLink);
      }
      
      if (customization.customMessage) {
        result = result.replace(/\{\{customMessage\}\}/g, customization.customMessage);
      }
      
      // Replace any other custom fields
      Object.keys(customization).forEach((key) => {
        const value = customization[key];
        if (typeof value === 'string') {
          const placeholder = `{{${key}}}`;
          result = result.replace(new RegExp(placeholder, 'g'), value);
        }
      });
      
      return result;
    };
    
    // Apply to all text fields
    if (customizedSlide.title) {
      customizedSlide.title = replacePlaceholders(customizedSlide.title);
    }
    if (customizedSlide.subtitle) {
      customizedSlide.subtitle = replacePlaceholders(customizedSlide.subtitle);
    }
    if (customizedSlide.content) {
      customizedSlide.content = replacePlaceholders(customizedSlide.content);
    }
    
    return customizedSlide;
  });
  
  return {
    ...template,
    slides: customizedSlides,
  };
}

/**
 * Insert custom questions into presentation at specified positions
 */
export function insertCustomQuestions(
  template: PresentationTemplate,
  questions: CustomQuestion[]
): PresentationTemplate {
  // Sort questions by position
  const sortedQuestions = [...questions].sort((a, b) => a.position - b.position);
  
  const newSlides = [...template.slides];
  
  // Insert question slides (reverse order to maintain indices)
  sortedQuestions.reverse().forEach((question) => {
    const questionSlide: any = {
      id: `question-${question.id || Math.random().toString(36).substr(2, 9)}`,
      type: 'quiz',
      title: question.questionText,
      duration: 0, // No auto-advance for questions
      questionType: question.questionType,
      isRequired: question.isRequired,
      options: question.options,
      metadata: question.metadata,
    };
    
    // Insert at position (clamp to valid range)
    const insertIndex = Math.min(Math.max(0, question.position), newSlides.length);
    newSlides.splice(insertIndex, 0, questionSlide);
  });
  
  return {
    ...template,
    slides: newSlides,
  };
}

/**
 * Create a fully customized presentation
 */
export function createCustomizedPresentation(
  template: PresentationTemplate,
  customization: {
    level: 'simple' | 'advanced';
    simple?: SimpleCustomization;
    questions?: CustomQuestion[];
  },
  answers?: QuestionAnswer[]
): CustomizedPresentation {
  let customizedTemplate = { ...template };
  
  // Apply simple customization first
  if (customization.simple) {
    customizedTemplate = applySimpleCustomization(customizedTemplate, customization.simple);
  }
  
  // Insert custom questions if advanced
  if (customization.level === 'advanced' && customization.questions) {
    customizedTemplate = insertCustomQuestions(customizedTemplate, customization.questions);
  }
  
  return {
    instanceId: '', // Will be set when saved to database
    presentationId: template.id,
    template: customizedTemplate,
    customization,
    answers: answers || [],
    status: 'draft',
  };
}

/**
 * Extract answers from a customized presentation
 */
export function extractAnswers(
  customizedPresentation: CustomizedPresentation
): QuestionAnswer[] {
  return customizedPresentation.answers || [];
}

/**
 * Validate that all required questions are answered
 */
export function validateRequiredQuestions(
  customizedPresentation: CustomizedPresentation
): { valid: boolean; missing: string[] } {
  if (customizedPresentation.customization.level !== 'advanced') {
    return { valid: true, missing: [] };
  }
  
  const questions = customizedPresentation.customization.questions || [];
  const answers = customizedPresentation.answers || [];
  const answeredQuestionIds = new Set(answers.map(a => a.questionId));
  
  const missing = questions
    .filter(q => q.isRequired && !answeredQuestionIds.has(q.id || ''))
    .map(q => q.questionText);
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

