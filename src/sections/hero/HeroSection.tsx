'use client';

import { TemplateData } from '../../types';
import { AnimationConfig } from '../../animations/types';
import { getHeroAnimationCSS, getHeroScrollAnimationCSS } from '../../animations/hero-animations';

interface HeroSectionProps {
  data: TemplateData;
  animation: AnimationConfig;
  className?: string;
}

export default function HeroSection({ data, animation, className = '' }: HeroSectionProps) {
  const animationCSS = getHeroAnimationCSS(animation);
  const scrollAnimationCSS = getHeroScrollAnimationCSS(animation);

  return (
    <section 
      className={`hero-section ${className}`}
      id="heroContainer"
    >
      <div 
        className="hero-content"
        id="heroContent"
      >
        <h1 
          className="hero-title"
          id="heroTitle"
        >
          {data.title}
        </h1>
        
        <p 
          className="hero-description"
          id="heroDescription"
        >
          {data.description}
        </p>
        
        {data.heroImage && (
          <img
            src={data.heroImage}
            alt="Hero"
            className="hero-image"
            id="heroImage"
          />
        )}
      </div>
    </section>
  );
}
