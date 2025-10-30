'use client';

import { AnimationConfig } from '../../animations/types';

interface FeaturesSectionProps {
  animation: AnimationConfig;
  className?: string;
}

export default function FeaturesSection({ animation, className = '' }: FeaturesSectionProps) {

  const features = [
    {
      icon: '🚀',
      title: 'Fast Performance',
      description: 'Lightning-fast loading times and smooth animations',
      bgColor: 'bg-blue-50',
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Perfect on all devices and screen sizes',
      bgColor: 'bg-green-50',
    },
    {
      icon: '✨',
      title: 'Modern UI',
      description: 'Beautiful, contemporary design that impresses',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <section 
      className={`features-section section bg-white ${className}`}
      id="featuresSection"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Amazing Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`text-center p-6 ${feature.bgColor} rounded-lg`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
