/**
 * Custom Questions Service Functions
 * 
 * Handles database operations for custom questions and answers
 */

import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { CustomQuestion, QuestionAnswer } from '@/types/presentation';

type QuestionRow = Database['public']['Tables']['custom_questions']['Row'];
type QuestionInsert = Database['public']['Tables']['custom_questions']['Insert'];
type AnswerRow = Database['public']['Tables']['question_answers']['Row'];
type AnswerInsert = Database['public']['Tables']['question_answers']['Insert'];

/**
 * Create a custom question
 */
export async function createQuestion(
  question: QuestionInsert
): Promise<QuestionRow> {
  const { data, error } = await supabase
    .from('custom_questions')
    .insert(question)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all questions for an instance
 */
export async function getInstanceQuestions(instanceId: string) {
  const { data, error } = await supabase
    .from('custom_questions')
    .select('*')
    .eq('instance_id', instanceId)
    .order('position', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Create multiple questions at once
 */
export async function createQuestions(questions: QuestionInsert[]) {
  const { data, error } = await supabase
    .from('custom_questions')
    .insert(questions)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Delete a question
 */
export async function deleteQuestion(questionId: string) {
  const { error } = await supabase
    .from('custom_questions')
    .delete()
    .eq('id', questionId);

  if (error) throw error;
}

/**
 * Submit an answer to a question
 */
export async function submitAnswer(
  answer: AnswerInsert
): Promise<AnswerRow> {
  // Use upsert to handle case where answer already exists
  const { data, error } = await supabase
    .from('question_answers')
    .upsert(answer, {
      onConflict: 'question_id',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all answers for an instance
 */
export async function getInstanceAnswers(instanceId: string) {
  const { data, error } = await supabase
    .from('question_answers')
    .select('*')
    .eq('instance_id', instanceId);

  if (error) throw error;
  return data;
}

/**
 * Submit multiple answers at once
 */
export async function submitAnswers(answers: AnswerInsert[]) {
  const { data, error } = await supabase
    .from('question_answers')
    .upsert(answers, {
      onConflict: 'question_id',
    })
    .select();

  if (error) throw error;
  return data;
}

