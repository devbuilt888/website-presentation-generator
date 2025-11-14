/**
 * Presentation Template Registry
 * 
 * Lightweight registry for frontend-loaded presentation templates.
 * This allows the frontend to handle hundreds of presentations efficiently.
 * 
 * To add a new template:
 * 1. Create the template data file in src/data/presentations/
 * 2. Import and register it here
 * 3. The template will be available via getTemplate()
 */

import { PresentationTemplate } from '@/types/presentation';
import { presentations } from '@/data/presentations';

// Registry map: template_id -> template
const templateRegistry = new Map<string, PresentationTemplate>();

// Register all templates
export function registerTemplates() {
  presentations.forEach((presentation) => {
    templateRegistry.set(presentation.id, {
      id: presentation.id,
      name: presentation.name || presentation.id,
      description: presentation.description,
      slides: presentation.slides,
      metadata: (presentation as any).metadata,
    });
  });
}

// Get a template by ID
export function getTemplate(templateId: string): PresentationTemplate | null {
  if (templateRegistry.size === 0) {
    registerTemplates();
  }
  return templateRegistry.get(templateId) || null;
}

// Get all available templates
export function getAllTemplates(): PresentationTemplate[] {
  if (templateRegistry.size === 0) {
    registerTemplates();
  }
  return Array.from(templateRegistry.values());
}

// Check if template exists
export function hasTemplate(templateId: string): boolean {
  if (templateRegistry.size === 0) {
    registerTemplates();
  }
  return templateRegistry.has(templateId);
}

