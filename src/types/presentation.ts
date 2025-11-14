/**
 * Presentation Types
 * 
 * These types define the structure for presentations stored in the frontend
 * and customized instances stored in the database.
 */

import { Json } from '@/lib/supabase/types';

// Base presentation slide structure
export interface PresentationSlide {
  id: string;
  type: 'personalized-hero' | 'animated-hero' | 'hero' | 'split' | 'grid' | 'quiz' | 'contact' | 'final';
  title?: string;
  subtitle?: string;
  content?: string;
  backgroundGif?: string;
  image?: string;
  duration: number;
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  [key: string]: any; // Allow additional fields for flexibility
}

// Base presentation template
export interface PresentationTemplate {
  id: string;
  name: string;
  description?: string;
  slides: PresentationSlide[];
  metadata?: Json;
}

// Simple customization fields (level 1)
export interface SimpleCustomization {
  recipientName?: string;
  storeLink?: string;
  customMessage?: string;
  [key: string]: any; // Allow additional simple fields
}

// Custom question structure (level 2 - advanced)
export interface CustomQuestion {
  id?: string;
  questionText: string;
  questionType: 'text' | 'multiple_choice' | 'yes_no' | 'rating';
  position: number; // Slide position where question appears
  isRequired: boolean;
  options?: Array<{
    id: string;
    text: string;
    value: any;
  }>;
  metadata?: Json;
}

// Question answer structure
export interface QuestionAnswer {
  questionId: string;
  answerText?: string;
  answerValue?: Json;
  answeredAt?: string;
}

// Customized presentation instance
export interface CustomizedPresentation {
  instanceId: string;
  presentationId: string;
  template: PresentationTemplate;
  customization: {
    level: 'simple' | 'advanced';
    simple?: SimpleCustomization;
    questions?: CustomQuestion[];
  };
  answers?: QuestionAnswer[];
  status: 'draft' | 'sent' | 'viewed' | 'completed';
}

// Presentation instance with database fields
export interface PresentationInstance {
  id: string;
  presentationId: string;
  createdBy: string;
  recipientName?: string;
  recipientEmail?: string;
  storeLink?: string;
  customizationLevel: 'simple' | 'advanced';
  status: 'draft' | 'sent' | 'viewed' | 'completed';
  sentAt?: string;
  viewedAt?: string;
  completedAt?: string;
  customFields?: SimpleCustomization;
  metadata?: Json;
}

