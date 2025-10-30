'use client';

import { useState, useEffect } from 'react';
import { TemplateData, StyleConfig } from '../types';
import { modernDesignSystem, generateAdvancedCSS } from '../styles/advanced-design-system';
import AdvancedDesignEditor from './AdvancedDesignEditor';
import PresentationMode from './PresentationMode';
import { generateSpectacularPresentationHTML } from './SpectacularPresentation';

export default function CuttingEdgeTemplateBuilder() {
  const [templateData, setTemplateData] = useState<TemplateData>({
    title: 'Your Amazing Presentation',
    description: 'Create stunning presentations with our cutting-edge template builder',
    heroImage: undefined,
    aboutText: 'We are a passionate team dedicated to creating beautiful, functional presentations that help businesses grow and succeed in the digital world.',
    contactEmail: 'hello@yourcompany.com',
    websiteUrl: 'https://yourwebsite.com',
    companyName: 'Your Company',
    inviteeName: 'Miguel',
    inviteeEmail: 'miguel@example.com',
    presentationTitle: 'Welcome to Our Presentation',
    callToAction: 'Empezar demo'
  });

  const [presentationSlides, setPresentationSlides] = useState([
    {
      id: 'personalized-hero',
      type: 'personalized-hero',
      title: 'Welcome Miguel',
      subtitle: 'Empezar demo',
      content: 'Experience our amazing presentation',
      backgroundGif: '/assets/mountains3.gif',
      userName: 'Miguel',
      userEmail: 'miguel@example.com',
      duration: 10000
    },
    {
      id: 'animated-hero',
      type: 'animated-hero',
      title: 'Welcome to Our Journey',
      subtitle: 'Discover the Future',
      content: 'Experience innovation like never before',
      backgroundGif: '/assets/mountains3.gif',
      duration: 8000
    },
    {
      id: 'hero',
      type: 'hero',
      title: 'Welcome to Our Presentation',
      subtitle: 'Discover amazing insights and solutions',
      content: 'This is where your journey begins. Let us show you what we can do together.',
      image: undefined,
      duration: 5000
    },
    {
      id: 'about',
      type: 'split',
      title: 'About Our Company',
      content: 'We are passionate about creating innovative solutions that drive business growth and success in the digital age.',
      image: undefined,
      duration: 4000
    },
    {
      id: 'features',
      type: 'grid',
      title: 'Our Key Features',
      content: 'Discover what makes us different and how we can help you achieve your goals.',
      features: [
        { icon: '🚀', title: 'Fast Performance', description: 'Lightning-fast solutions' },
        { icon: '💡', title: 'Innovation', description: 'Cutting-edge technology' },
        { icon: '🎯', title: 'Precision', description: 'Targeted results' }
      ],
      duration: 6000
    },
    {
      id: 'stats',
      type: 'stats',
      title: 'Our Impact in Numbers',
      content: 'Measurable results that speak for themselves',
      stats: [
        { number: '500+', label: 'Happy Clients', icon: '👥' },
        { number: '99%', label: 'Satisfaction Rate', icon: '⭐' },
        { number: '24/7', label: 'Support Available', icon: '🛠️' },
        { number: '50+', label: 'Countries Served', icon: '🌍' }
      ],
      duration: 5000
    },
    {
      id: 'timeline',
      type: 'timeline',
      title: 'Our Journey',
      content: 'Key milestones in our company\'s growth',
      timeline: [
        { year: '2020', title: 'Company Founded', description: 'Started with a vision to revolutionize the industry' },
        { year: '2021', title: 'First Major Client', description: 'Secured our first enterprise partnership' },
        { year: '2022', title: 'International Expansion', description: 'Expanded operations to 10 countries' },
        { year: '2023', title: 'Award Recognition', description: 'Named Best Innovation Company of the Year' }
      ],
      duration: 7000
    },
    {
      id: 'testimonials',
      type: 'testimonials',
      title: 'What Our Clients Say',
      content: 'Real feedback from satisfied customers',
      testimonials: [
        { 
          quote: 'This company transformed our business completely. The results exceeded our expectations.',
          author: 'Sarah Johnson',
          role: 'CEO, TechCorp',
          avatar: '👩‍💼'
        },
        { 
          quote: 'Outstanding service and incredible attention to detail. Highly recommended!',
          author: 'Michael Chen',
          role: 'CTO, InnovateLab',
          avatar: '👨‍💻'
        },
        { 
          quote: 'Professional, reliable, and always delivers on time. Perfect partnership.',
          author: 'Emily Rodriguez',
          role: 'Director, GlobalTech',
          avatar: '👩‍🎓'
        }
      ],
      duration: 6000
    },
    {
      id: 'interactive',
      type: 'questionnaire',
      title: 'Let\'s Get to Know You',
      content: 'Help us understand your needs better',
      questions: [
        {
          id: 'q1',
          question: 'What is your primary goal?',
          options: [
            { id: 'a1', text: 'Increase Sales', value: 'sales' },
            { id: 'a2', text: 'Improve Efficiency', value: 'efficiency' },
            { id: 'a3', text: 'Expand Market', value: 'expansion' }
          ]
        },
        {
          id: 'q2',
          question: 'What is your biggest challenge?',
          options: [
            { id: 'b1', text: 'Time Management', value: 'time' },
            { id: 'b2', text: 'Resource Allocation', value: 'resources' },
            { id: 'b3', text: 'Team Coordination', value: 'team' }
          ]
        }
      ],
      duration: 8000
    },
    {
      id: 'contact',
      type: 'contact',
      title: 'Get In Touch',
      content: 'Ready to start your journey with us?',
      contactInfo: {
        email: 'hello@yourcompany.com',
        phone: '+1 (555) 123-4567',
        website: 'https://yourwebsite.com'
      },
      duration: 4000
    }
  ]);

  const [activeMode, setActiveMode] = useState<'design' | 'presentation' | 'export'>('design');
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(modernDesignSystem as any);
  const [customEffects, setCustomEffects] = useState({
    blur: 20,
    shadowIntensity: 25,
    borderOpacity: 0.2,
    animationSpeed: 1,
    glowIntensity: 30,
    particleCount: 50,
    gradientAngle: 135,
    noiseIntensity: 0.1,
    morphingSpeed: 2,
    holographicIntensity: 0.5
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('resize', handleOrientationChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    handleOrientationChange();

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Update presentation slides when templateData changes
  useEffect(() => {
    setPresentationSlides(prevSlides => {
      const updatedSlides = [...prevSlides];
      const personalizedHeroIndex = updatedSlides.findIndex(slide => slide.id === 'personalized-hero');
      
      if (personalizedHeroIndex !== -1) {
        updatedSlides[personalizedHeroIndex] = {
          ...updatedSlides[personalizedHeroIndex],
          title: `Welcome ${templateData.inviteeName}`,
          subtitle: templateData.callToAction,
          userName: templateData.inviteeName,
          userEmail: templateData.inviteeEmail
        };
      }
      
      return updatedSlides;
    });
  }, [templateData.inviteeName, templateData.callToAction, templateData.inviteeEmail]);

  const handleStyleChange = (config: any) => {
    setStyleConfig(config);
  };

  const handleEffectChange = (effects: any) => {
    setCustomEffects(effects);
  };

  const handleContentChange = (field: string, value: string) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setTemplateData(prev => ({
        ...prev,
        heroImage: e.target?.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setTemplateData(prev => ({
      ...prev,
      heroImage: undefined
    }));
  };

  const handleExport = () => {
    const htmlContent = generateSpectacularPresentationHTML({
      templateData,
      styleConfig,
      customEffects,
      presentationSlides
    });
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateData.companyName || 'presentation'}-template.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePresentationHTML = () => {
    const advancedCSS = generateAdvancedCSS(styleConfig);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${templateData.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Lato:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        ${advancedCSS}
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            overflow-x: hidden;
            font-family: var(--font-family);
            background: var(--color-background);
        }
        
        .presentation-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .slide {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .slide-content {
            text-align: center;
            color: white;
            z-index: 10;
            position: relative;
        }
        
        .slide-title {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 2rem;
            text-shadow: 0 0 20px var(--color-primary);
        }
        
        .slide-description {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .slide-image {
            max-width: 400px;
            border-radius: 1rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .glass-effect {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        
        .gradient-border {
            position: relative;
            background: var(--color-surface);
            border-radius: var(--radius-lg);
        }
        
        .gradient-border::before {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px;
            background: linear-gradient(45deg, var(--color-primary), var(--color-secondary), var(--color-accent));
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: xor;
        }
        
        .floating {
            animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .glow {
            box-shadow: 0 0 20px var(--color-primary);
        }
        
        .text-glow {
            text-shadow: 0 0 10px var(--color-primary);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
            animation: slideUp 0.8s ease-out forwards;
        }
        
        .animate-scaleIn {
            animation: scaleIn 0.8s ease-out forwards;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .slide-title {
                font-size: 2.5rem;
            }
            
            .slide-description {
                font-size: 1.2rem;
            }
            
            .slide-image {
                max-width: 300px;
            }
        }
        
        /* Portrait Mode Styles */
        @media (max-height: 600px) {
            .presentation-container {
                padding: 2rem;
            }
            
            .slide-title {
                font-size: 2rem;
            }
            
            .slide-description {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="presentation-container">
        <!-- Hero Slide -->
        <div class="slide" style="background: linear-gradient(${customEffects.gradientAngle}deg, ${styleConfig.colors.primary} 0%, ${styleConfig.colors.secondary} 100%);">
            <div class="slide-content">
                <h1 class="slide-title animate-fadeIn">${templateData.title}</h1>
                <p class="slide-description animate-slideUp" style="animation-delay: 0.5s;">${templateData.description}</p>
                ${templateData.heroImage ? '<img src="' + templateData.heroImage + '" alt="Hero" class="slide-image animate-scaleIn" style="animation-delay: 1s;">' : ''}
            </div>
        </div>
    </div>

    <script>
        // Presentation Logic
        let currentSlide = 0;
        const slides = [
            { id: 'hero', title: 'Hero Section', duration: 5000 },
            { id: 'about', title: 'About Section', duration: 4000 },
            { id: 'features', title: 'Features Section', duration: 4000 },
            { id: 'contact', title: 'Contact Section', duration: 3000 },
        ];
        
        let isPlaying = false;
        let progress = 0;
        let interval;
        
        function createSlide(slideData) {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.style.background = \`linear-gradient(\${${customEffects.gradientAngle}}deg, ${styleConfig.colors.primary} 0%, ${styleConfig.colors.secondary} 100%)\`;
            
            switch(slideData.id) {
                case 'hero':
                    slide.innerHTML = \`
                        <div class="slide-content">
                            <h1 class="slide-title animate-fadeIn">${templateData.title}</h1>
                            <p class="slide-description animate-slideUp" style="animation-delay: 0.5s;">${templateData.description}</p>
                            ${templateData.heroImage ? '<img src="' + templateData.heroImage + '" alt="Hero" class="slide-image animate-scaleIn" style="animation-delay: 1s;">' : ''}
                        </div>
                    \`;
                    break;
                case 'about':
                    slide.innerHTML = \`
                        <div class="slide-content">
                            <h1 class="slide-title animate-fadeIn">About ${templateData.companyName}</h1>
                            <p class="slide-description animate-slideUp" style="animation-delay: 0.5s;">${templateData.aboutText}</p>
                        </div>
                    \`;
                    break;
                case 'features':
                    slide.innerHTML = \`
                        <div class="slide-content">
                            <h1 class="slide-title animate-fadeIn">Amazing Features</h1>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                                <div class="glass-effect p-6 rounded-xl animate-scaleIn" style="animation-delay: 0.2s;">
                                    <div class="text-4xl mb-4">🚀</div>
                                    <h3 class="text-xl font-semibold mb-2">Fast Performance</h3>
                                    <p class="text-sm">Lightning-fast loading times</p>
                                </div>
                                <div class="glass-effect p-6 rounded-xl animate-scaleIn" style="animation-delay: 0.4s;">
                                    <div class="text-4xl mb-4">📱</div>
                                    <h3 class="text-xl font-semibold mb-2">Responsive Design</h3>
                                    <p class="text-sm">Perfect on all devices</p>
                                </div>
                                <div class="glass-effect p-6 rounded-xl animate-scaleIn" style="animation-delay: 0.6s;">
                                    <div class="text-4xl mb-4">✨</div>
                                    <h3 class="text-xl font-semibold mb-2">Modern UI</h3>
                                    <p class="text-sm">Beautiful, contemporary design</p>
                                </div>
                            </div>
                        </div>
                    \`;
                    break;
                case 'contact':
                    slide.innerHTML = \`
                        <div class="slide-content">
                            <h1 class="slide-title animate-fadeIn">Get In Touch</h1>
                            <div class="space-y-4 animate-slideUp" style="animation-delay: 0.5s;">
                                <div class="text-2xl">
                                    <strong>Email:</strong> ${templateData.contactEmail}
                                </div>
                                ${templateData.websiteUrl ? '<div class="text-2xl"><strong>Website:</strong> ' + templateData.websiteUrl + '</div>' : ''}
                            </div>
                        </div>
                    \`;
                    break;
            }
            
            return slide;
        }
        
        function showSlide(index) {
            const container = document.querySelector('.presentation-container');
            container.innerHTML = '';
            container.appendChild(createSlide(slides[index]));
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
            progress = 0;
        }
        
        function startPresentation() {
            if (interval) clearInterval(interval);
            interval = setInterval(() => {
                progress += 100 / (slides[currentSlide].duration / 100);
                if (progress >= 100) {
                    nextSlide();
                    progress = 0;
                }
            }, 100);
        }
        
        function stopPresentation() {
            if (interval) clearInterval(interval);
        }
        
        // Initialize
        showSlide(0);
        
        // Auto-play after 2 seconds
        setTimeout(() => {
            isPlaying = true;
            startPresentation();
        }, 2000);
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    if (isPlaying) {
                        stopPresentation();
                        isPlaying = false;
                    } else {
                        startPresentation();
                        isPlaying = true;
                    }
                    break;
                case 'ArrowRight':
                    nextSlide();
                    break;
                case 'ArrowLeft':
                    currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
                    showSlide(currentSlide);
                    break;
            }
        });
        
        // Touch controls
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
                    showSlide(currentSlide);
                }
            }
        }
    </script>
</body>
</html>`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Presentation Studio</h1>
                <p className="text-white/70">Cutting-edge presentation builder</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveMode('design')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeMode === 'design'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                🎨 Design
              </button>
              <button
                onClick={() => setActiveMode('presentation')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeMode === 'presentation'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                🎬 Present
              </button>
              <button
                onClick={handleExport}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/25"
              >
                📤 Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {activeMode === 'design' && (
          <AdvancedDesignEditor
            templateData={templateData}
            onStyleChange={handleStyleChange}
            onEffectChange={handleEffectChange}
            onContentChange={handleContentChange}
            onImageUpload={handleImageUpload}
            presentationSlides={presentationSlides}
            styleConfig={styleConfig}
            customEffects={customEffects}
          />
        )}
        
        {activeMode === 'presentation' && (
          <PresentationMode
            templateData={templateData}
            styleConfig={styleConfig}
            customEffects={customEffects}
            presentationSlides={presentationSlides}
            isFullscreen={isFullscreen}
            orientation={orientation}
          />
        )}
      </div>
    </div>
  );
}
