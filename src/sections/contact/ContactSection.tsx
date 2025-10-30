'use client';

import { TemplateData } from '../../types';
import { AnimationConfig } from '../../animations/types';

interface ContactSectionProps {
  data: TemplateData;
  animation: AnimationConfig;
  className?: string;
}

export default function ContactSection({ data, animation, className = '' }: ContactSectionProps) {

  return (
    <section 
      className={`contact-section section bg-gray-100 ${className}`}
      id="contactSection"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Get In Touch</h2>
          <div className="space-y-4">
            <p className="text-lg">
              <strong>Email:</strong> 
              <a 
                href={`mailto:${data.contactEmail}`} 
                className="text-blue-600 hover:underline ml-2"
              >
                {data.contactEmail}
              </a>
            </p>
            {data.websiteUrl && (
              <p className="text-lg">
                <strong>Website:</strong> 
                <a 
                  href={data.websiteUrl} 
                  className="text-blue-600 hover:underline ml-2" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.websiteUrl}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
