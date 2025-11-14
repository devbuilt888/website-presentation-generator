/**
 * Database Types
 * 
 * These types are generated from the Supabase schema.
 * When adding new fields to tables, update both:
 * 1. The database schema (supabase/migrations/)
 * 2. These TypeScript types
 * 3. The corresponding interfaces in src/types/
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
          metadata: Json | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Json | null;
        };
      };
      presentations: {
        Row: {
          id: string;
          template_id: string;
          name: string;
          description: string | null;
          created_by: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          template_id: string;
          name: string;
          description?: string | null;
          created_by: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          template_id?: string;
          name?: string;
          description?: string | null;
          created_by?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
          metadata?: Json | null;
        };
      };
      user_presentation_access: {
        Row: {
          id: string;
          user_id: string;
          presentation_id: string;
          granted_by: string | null;
          granted_at: string;
          can_edit: boolean;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          presentation_id: string;
          granted_by?: string | null;
          granted_at?: string;
          can_edit?: boolean;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          presentation_id?: string;
          granted_by?: string | null;
          granted_at?: string;
          can_edit?: boolean;
          metadata?: Json | null;
        };
      };
      presentation_instances: {
        Row: {
          id: string;
          presentation_id: string;
          created_by: string;
          recipient_name: string | null;
          recipient_email: string | null;
          store_link: string | null;
          customization_level: 'simple' | 'advanced';
          status: 'draft' | 'sent' | 'viewed' | 'completed';
          sent_at: string | null;
          viewed_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
          custom_fields: Json | null;
          metadata: Json | null;
          share_token: string | null;
        };
        Insert: {
          id?: string;
          presentation_id: string;
          created_by: string;
          recipient_name?: string | null;
          recipient_email?: string | null;
          store_link?: string | null;
          customization_level?: 'simple' | 'advanced';
          status?: 'draft' | 'sent' | 'viewed' | 'completed';
          sent_at?: string | null;
          viewed_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          custom_fields?: Json | null;
          metadata?: Json | null;
          share_token?: string | null;
        };
        Update: {
          id?: string;
          presentation_id?: string;
          created_by?: string;
          recipient_name?: string | null;
          recipient_email?: string | null;
          store_link?: string | null;
          customization_level?: 'simple' | 'advanced';
          status?: 'draft' | 'sent' | 'viewed' | 'completed';
          sent_at?: string | null;
          viewed_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          custom_fields?: Json | null;
          metadata?: Json | null;
          share_token?: string | null;
        };
      };
      custom_questions: {
        Row: {
          id: string;
          instance_id: string;
          question_text: string;
          question_type: 'text' | 'multiple_choice' | 'yes_no' | 'rating';
          position: number;
          is_required: boolean;
          options: Json | null;
          created_at: string;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          instance_id: string;
          question_text: string;
          question_type?: 'text' | 'multiple_choice' | 'yes_no' | 'rating';
          position: number;
          is_required?: boolean;
          options?: Json | null;
          created_at?: string;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          instance_id?: string;
          question_text?: string;
          question_type?: 'text' | 'multiple_choice' | 'yes_no' | 'rating';
          position?: number;
          is_required?: boolean;
          options?: Json | null;
          created_at?: string;
          metadata?: Json | null;
        };
      };
      question_answers: {
        Row: {
          id: string;
          question_id: string;
          instance_id: string;
          answer_text: string | null;
          answer_value: Json | null;
          answered_at: string;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          question_id: string;
          instance_id: string;
          answer_text?: string | null;
          answer_value?: Json | null;
          answered_at?: string;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          question_id?: string;
          instance_id?: string;
          answer_text?: string | null;
          answer_value?: Json | null;
          answered_at?: string;
          metadata?: Json | null;
        };
      };
    };
  };
}

