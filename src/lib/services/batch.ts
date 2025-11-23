/**
 * Batch Import Service Functions
 * 
 * Handles batch creation of presentation instances from contact lists
 */

import { createPresentation } from './presentations';
import { createInstance, markInstanceAsSent } from './instances';
import { Database } from '@/lib/supabase/types';
import { getTemplate } from '@/lib/presentations/template-registry';
import { createCustomizedPresentation } from '@/lib/presentations/customization';

type InstanceRow = Database['public']['Tables']['presentation_instances']['Row'];

export interface ContactRow {
  name: string;
  email?: string;
  storeLink?: string;
  [key: string]: any; // Allow additional custom fields
}

export interface BatchImportOptions {
  templateId: string;
  userId: string;
  contacts: ContactRow[];
  defaultStoreLink?: string;
  customizationLevel?: 'simple' | 'advanced';
  customQuestions?: any[];
}

export interface BatchImportResult {
  success: InstanceRow[];
  failed: Array<{ contact: ContactRow; error: string }>;
  total: number;
  succeeded: number;
  failedCount: number;
}

/**
 * Create presentation instances in batch
 * 
 * @param options Batch import options
 * @returns Result with successful and failed instances
 */
export async function createBatchInstances(
  options: BatchImportOptions
): Promise<BatchImportResult> {
  const {
    templateId,
    userId,
    contacts,
    defaultStoreLink,
    customizationLevel = 'simple',
    customQuestions,
  } = options;

  const result: BatchImportResult = {
    success: [],
    failed: [],
    total: contacts.length,
    succeeded: 0,
    failedCount: 0,
  };

  // Get template to validate it exists
  const template = getTemplate(templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  // Process contacts sequentially to avoid overwhelming the database
  // For very large batches, consider using a queue/background job
  for (const contact of contacts) {
    try {
      // Validate required fields
      if (!contact.name || contact.name.trim() === '') {
        result.failed.push({
          contact,
          error: 'Name is required',
        });
        result.failedCount++;
        continue;
      }

      // Create customized presentation data
      const customized = createCustomizedPresentation(template, {
        level: customizationLevel,
        simple: {
          recipientName: contact.name.trim(),
          storeLink: contact.storeLink || defaultStoreLink || '',
        },
        questions: customQuestions,
      });

      // Create presentation record
      const presentation = await createPresentation({
        template_id: templateId,
        name: `${template.name} - ${contact.name.trim()}`,
        description: template.description || `Customized presentation for ${contact.name.trim()}`,
        created_by: userId,
        is_public: false,
      });

      // Create instance
      const instance = await createInstance({
        presentation_id: presentation.id,
        created_by: userId,
        recipient_name: contact.name.trim(),
        recipient_email: contact.email?.trim() || null,
        store_link: contact.storeLink || defaultStoreLink || null,
        customization_level: customizationLevel,
        custom_fields: customized.customization.simple as any,
        status: 'draft',
      });

      // Mark as sent (consistent with regular form creation)
      const updatedInstance = await markInstanceAsSent(instance.id);

      result.success.push(updatedInstance);
      result.succeeded++;

      // Add a small delay to avoid rate limiting (optional)
      // await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      result.failed.push({
        contact,
        error: error.message || 'Unknown error occurred',
      });
      result.failedCount++;
      console.error(`Failed to create instance for ${contact.name}:`, error);
    }
  }

  return result;
}

/**
 * Parse CSV file content into contact rows
 * 
 * @param csvContent CSV file content as string
 * @returns Array of contact objects
 */
export function parseCSV(csvContent: string): ContactRow[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const nameIndex = headers.findIndex(h => 
    h === 'name' || h === 'nombre' || h === 'recipient name' || h === 'recipient_name'
  );
  const emailIndex = headers.findIndex(h => 
    h === 'email' || h === 'correo' || h === 'recipient email' || h === 'recipient_email'
  );
  const storeLinkIndex = headers.findIndex(h => 
    h === 'store link' || h === 'store_link' || h === 'link' || h === 'url'
  );

  if (nameIndex === -1) {
    throw new Error('CSV must contain a "name" column');
  }

  // Parse data rows
  const contacts: ContactRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length === 0 || !values[nameIndex]) continue;

    const contact: ContactRow = {
      name: values[nameIndex],
    };

    if (emailIndex !== -1 && values[emailIndex]) {
      contact.email = values[emailIndex];
    }

    if (storeLinkIndex !== -1 && values[storeLinkIndex]) {
      contact.storeLink = values[storeLinkIndex];
    }

    // Add any additional columns as custom fields
    headers.forEach((header, idx) => {
      if (idx !== nameIndex && idx !== emailIndex && idx !== storeLinkIndex && values[idx]) {
        contact[header] = values[idx];
      }
    });

    contacts.push(contact);
  }

  return contacts;
}

/**
 * Validate contact data
 */
export function validateContact(contact: ContactRow): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!contact.name || contact.name.trim() === '') {
    errors.push('Name is required');
  }

  if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    errors.push('Invalid email format');
  }

  if (contact.storeLink && !/^https?:\/\/.+/.test(contact.storeLink)) {
    errors.push('Store link must be a valid URL (http:// or https://)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

