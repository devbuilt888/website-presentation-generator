'use client';

import { TemplateData } from '../../types';
import { AnimationConfig } from '../../animations/types';

interface AboutSectionProps {
  data: TemplateData;
  animation: AnimationConfig;
  className?: string;
}

export default function AboutSection({ data, animation, className = '' }: AboutSectionProps) {

  return (
    <section 
      className={`about-section section bg-white ${className}`}
      id="aboutSection"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            About {data.companyName}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {data.aboutText}
          </p>
        </div>
      </div>
    </section>
  );
}
