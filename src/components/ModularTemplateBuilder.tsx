'use client';

import { useState } from 'react';
import { saveAs } from 'file-saver';
import { TemplateData, SectionConfig, StyleConfig } from '../types';
import { themes } from '../styles/themes';
import { heroAnimations } from '../animations/hero-animations';
import { sectionAnimations } from '../animations/section-animations';
import { getThemeCSS } from '../styles/themes';
import { getEffectCSS } from '../styles/effects';
import { EffectConfig } from '../styles/effects';

// Import sections
import HeroSection from '../sections/hero/HeroSection';
import AboutSection from '../sections/about/AboutSection';
import ContactSection from '../sections/contact/ContactSection';
import FeaturesSection from '../sections/features/FeaturesSection';

// Import config components
import AnimationSelector from '../config/AnimationSelector';
import ThemeSelector from '../config/ThemeSelector';

// Import form components
import ImageUpload from './ImageUpload';
import TextInput from './TextInput';

export default function ModularTemplateBuilder() {
  const [templateData, setTemplateData] = useState<TemplateData>({
    title: 'Your Amazing Website',
    description: 'Create something incredible with our template builder',
    heroImage: undefined,
    aboutText: 'We are a passionate team dedicated to creating beautiful, functional websites that help businesses grow and succeed in the digital world.',
    contactEmail: 'hello@yourcompany.com',
    websiteUrl: 'https://yourwebsite.com',
    companyName: 'Your Company'
  });

  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'preview'>('content');
  
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(themes.modern);
  const [effectConfig, setEffectConfig] = useState<EffectConfig>({
    shadows: 'medium',
    borders: 'thin',
    gradients: 'subtle',
    blur: 'none'
  });

  const [sectionConfig, setSectionConfig] = useState<SectionConfig>({
    hero: {
      enabled: true,
      animation: heroAnimations['slide-up'],
      style: themes.modern
    },
    about: {
      enabled: true,
      animation: sectionAnimations['fade-in'],
      style: themes.modern
    },
    contact: {
      enabled: true,
      animation: sectionAnimations['slide-in-left'],
      style: themes.modern
    },
    features: {
      enabled: true,
      animation: sectionAnimations['bounce-in'],
      style: themes.modern
    }
  });

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
    const htmlContent = generateHTML();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${templateData.companyName || 'website'}-template.html`);
  };

  const generateHTML = () => {
    const themeCSS = getThemeCSS(styleConfig);
    const effectCSS = getEffectCSS(effectConfig);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${templateData.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        ${themeCSS}
        ${effectCSS}
        
        /* Hero Animation Styles */
        .hero-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hero-content {
            text-align: center;
            color: white;
            transform: scale(1);
            transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hero-title {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 1rem;
            opacity: 1;
            transform: translateY(0);
            transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hero-description {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            opacity: 1;
            transform: translateY(0);
            transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hero-image {
            max-width: 400px;
            border-radius: 1rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .content-wrapper {
            margin-top: 100vh;
            background: var(--color-background);
        }
        
        .section {
            padding: var(--spacing) 0;
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease-out;
        }
        
        .section.visible {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
</head>
<body>
    <!-- Hero Section -->
    ${sectionConfig.hero.enabled ? `
    <div class="hero-container" id="heroContainer">
        <div class="hero-content" id="heroContent">
            <h1 class="hero-title" id="heroTitle">${templateData.title}</h1>
            <p class="hero-description" id="heroDescription">${templateData.description}</p>
            ${templateData.heroImage ? `<img src="${templateData.heroImage}" alt="Hero" class="hero-image" id="heroImage">` : ''}
        </div>
    </div>
    ` : ''}
    
    <div class="content-wrapper">
        ${sectionConfig.about.enabled ? `
        <!-- About Section -->
        <section class="section" id="aboutSection">
            <div class="container mx-auto px-4">
                <div class="max-w-3xl mx-auto text-center">
                    <h2 class="heading-${styleConfig.typography.headingSize} mb-6">About ${templateData.companyName}</h2>
                    <p class="text-lg text-gray-600 leading-relaxed">${templateData.aboutText}</p>
                </div>
            </div>
        </section>
        ` : ''}
        
        ${sectionConfig.features.enabled ? `
        <!-- Features Section -->
        <section class="section" id="featuresSection">
            <div class="container mx-auto px-4">
                <div class="max-w-4xl mx-auto">
                    <h2 class="heading-${styleConfig.typography.headingSize} mb-8 text-center">Amazing Features</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="text-center p-6 bg-blue-50 rounded-lg card-shadow">
                            <div class="text-4xl mb-4">🚀</div>
                            <h3 class="text-xl font-semibold mb-2">Fast Performance</h3>
                            <p class="text-gray-600">Lightning-fast loading times and smooth animations</p>
                        </div>
                        <div class="text-center p-6 bg-green-50 rounded-lg card-shadow">
                            <div class="text-4xl mb-4">📱</div>
                            <h3 class="text-xl font-semibold mb-2">Responsive Design</h3>
                            <p class="text-gray-600">Perfect on all devices and screen sizes</p>
                        </div>
                        <div class="text-center p-6 bg-purple-50 rounded-lg card-shadow">
                            <div class="text-4xl mb-4">✨</div>
                            <h3 class="text-xl font-semibold mb-2">Modern UI</h3>
                            <p class="text-gray-600">Beautiful, contemporary design that impresses</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        ` : ''}
        
        ${sectionConfig.contact.enabled ? `
        <!-- Contact Section -->
        <section class="section" id="contactSection">
            <div class="container mx-auto px-4">
                <div class="max-w-2xl mx-auto text-center">
                    <h2 class="heading-${styleConfig.typography.headingSize} mb-6">Get In Touch</h2>
                    <div class="space-y-4">
                        <p class="text-lg">
                            <strong>Email:</strong> 
                            <a href="mailto:${templateData.contactEmail}" class="text-blue-600 hover:underline">
                                ${templateData.contactEmail}
                            </a>
                        </p>
                        ${templateData.websiteUrl ? `
                        <p class="text-lg">
                            <strong>Website:</strong> 
                            <a href="${templateData.websiteUrl}" class="text-blue-600 hover:underline" target="_blank">
                                ${templateData.websiteUrl}
                            </a>
                        </p>
                        ` : ''}
                    </div>
                </div>
            </div>
        </section>
        ` : ''}
        
        <!-- Footer -->
        <footer class="section bg-gray-800 text-white" id="footerSection">
            <div class="container mx-auto px-4 text-center">
                <p>&copy; 2024 ${templateData.companyName}. All rights reserved.</p>
            </div>
        </footer>
    </div>

    <script>
        // Animation logic here
        let isScrolled = false;
        
        function handleScroll() {
            const scrollY = window.scrollY;
            const heroContainer = document.getElementById('heroContainer');
            
            if (scrollY > 100 && !isScrolled && heroContainer) {
                isScrolled = true;
                heroContainer.style.height = '80px';
                heroContainer.style.alignItems = 'center';
            } else if (scrollY <= 100 && isScrolled && heroContainer) {
                isScrolled = false;
                heroContainer.style.height = '100vh';
                heroContainer.style.alignItems = 'center';
            }
            
            // Trigger section animations
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    section.classList.add('visible');
                }
            });
        }
        
        window.addEventListener('scroll', handleScroll);
    </script>
</body>
</html>`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Modular Website Template Builder</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'content'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'design'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Design
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Form */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Website Content</h2>
                
                <div className="space-y-4">
                  <TextInput
                    label="Website Title"
                    value={templateData.title}
                    onChange={(value) => setTemplateData(prev => ({ ...prev, title: value }))}
                    placeholder="Enter your website title"
                    required
                  />
                  
                  <TextInput
                    label="Description"
                    value={templateData.description}
                    onChange={(value) => setTemplateData(prev => ({ ...prev, description: value }))}
                    placeholder="Brief description of your website"
                    type="textarea"
                    rows={3}
                    required
                  />
                  
                  <TextInput
                    label="Company Name"
                    value={templateData.companyName}
                    onChange={(value) => setTemplateData(prev => ({ ...prev, companyName: value }))}
                    placeholder="Your company name"
                    required
                  />
                  
                  <TextInput
                    label="About Text"
                    value={templateData.aboutText}
                    onChange={(value) => setTemplateData(prev => ({ ...prev, aboutText: value }))}
                    placeholder="Tell your story..."
                    type="textarea"
                    rows={4}
                    required
                  />
                  
                  <TextInput
                    label="Contact Email"
                    value={templateData.contactEmail}
                    onChange={(value) => setTemplateData(prev => ({ ...prev, contactEmail: value }))}
                    placeholder="your@email.com"
                    type="email"
                    required
                  />
                  
                  <TextInput
                    label="Website URL"
                    value={templateData.websiteUrl}
                    onChange={(value) => setTemplateData(prev => ({ ...prev, websiteUrl: value }))}
                    placeholder="https://yourwebsite.com"
                    type="url"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Hero Image</h2>
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  uploadedImage={templateData.heroImage}
                  onRemoveImage={handleRemoveImage}
                  label="Upload Hero Image"
                />
              </div>
            </div>
          )}

          {/* Design Configuration */}
          {activeTab === 'design' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Theme & Style</h2>
                <ThemeSelector
                  config={styleConfig}
                  onChange={setStyleConfig}
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Section Animations</h2>
                <div className="space-y-6">
                  <AnimationSelector
                    type="hero"
                    config={sectionConfig.hero.animation}
                    onChange={(animation) => setSectionConfig(prev => ({
                      ...prev,
                      hero: { ...prev.hero, animation }
                    }))}
                    label="Hero Section Animation"
                  />
                  
                  <AnimationSelector
                    type="section"
                    config={sectionConfig.about.animation}
                    onChange={(animation) => setSectionConfig(prev => ({
                      ...prev,
                      about: { ...prev.about, animation }
                    }))}
                    label="About Section Animation"
                  />
                  
                  <AnimationSelector
                    type="section"
                    config={sectionConfig.contact.animation}
                    onChange={(animation) => setSectionConfig(prev => ({
                      ...prev,
                      contact: { ...prev.contact, animation }
                    }))}
                    label="Contact Section Animation"
                  />
                  
                  <AnimationSelector
                    type="section"
                    config={sectionConfig.features.animation}
                    onChange={(animation) => setSectionConfig(prev => ({
                      ...prev,
                      features: { ...prev.features, animation }
                    }))}
                    label="Features Section Animation"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Section Toggles</h2>
                <div className="space-y-4">
                  {Object.entries(sectionConfig).map(([key, config]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 capitalize">
                        {key} Section
                      </label>
                      <button
                        onClick={() => setSectionConfig(prev => ({
                          ...prev,
                          [key]: { ...prev[key as keyof SectionConfig], enabled: !config.enabled }
                        }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          config.enabled ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          config.enabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preview - Show on content, design, and preview tabs */}
          {(activeTab === 'content' || activeTab === 'design' || activeTab === 'preview') && (
            <div className={`${activeTab === 'design' ? 'lg:sticky lg:top-8' : 'lg:sticky lg:top-8'}`}>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Template Preview</h3>
                  <button
                    onClick={handleExport}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Export Template
                  </button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div 
                    className="text-white p-6 text-center"
                    style={{
                      background: `linear-gradient(135deg, ${styleConfig.colors.primary} 0%, ${styleConfig.colors.secondary} 100%)`,
                      fontFamily: styleConfig.typography.fontFamily,
                    }}
                  >
                    <h4 
                      className="font-bold mb-2"
                      style={{
                        fontSize: styleConfig.typography.headingSize === 'large' ? '1.5rem' : 
                                 styleConfig.typography.headingSize === 'medium' ? '1.25rem' : '1rem'
                      }}
                    >
                      {templateData.title}
                    </h4>
                    <p className="text-sm mb-4 opacity-90">{templateData.description}</p>
                    {templateData.heroImage && (
                      <img 
                        src={templateData.heroImage} 
                        alt="Hero" 
                        className="mx-auto rounded-lg max-w-32 h-20 object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="p-4 space-y-3" style={{ fontFamily: styleConfig.typography.fontFamily }}>
                    <div>
                      <h5 
                        className="font-semibold mb-1"
                        style={{ color: styleConfig.colors.primary }}
                      >
                        About {templateData.companyName}
                      </h5>
                      <p className="text-sm text-gray-600 line-clamp-2">{templateData.aboutText}</p>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Email:</span>
                        <span 
                          className="ml-1"
                          style={{ color: styleConfig.colors.primary }}
                        >
                          {templateData.contactEmail}
                        </span>
                      </div>
                      {templateData.websiteUrl && (
                        <div className="text-sm mt-1">
                          <span className="font-medium text-gray-700">Website:</span>
                          <span 
                            className="ml-1"
                            style={{ color: styleConfig.colors.primary }}
                          >
                            {templateData.websiteUrl}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Preview */}
        {activeTab === 'preview' && (
          <div className="w-full relative">
            {/* Floating Editor Menu */}
            <div className="fixed top-4 left-4 z-50">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border p-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('content')}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Content
                  </button>
                  <button
                    onClick={() => setActiveTab('design')}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                    Edit Design
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Scroll Animation Script */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  let isScrolled = false;
                  
                  function handleScroll() {
                    const scrollY = window.scrollY;
                    const heroContainer = document.getElementById('previewHeroContainer');
                    const heroContent = document.getElementById('previewHeroContent');
                    const heroTitle = document.getElementById('previewHeroTitle');
                    const heroDescription = document.getElementById('previewHeroDescription');
                    const heroImage = document.getElementById('previewHeroImage');
                    
                    if (scrollY > 100 && !isScrolled && heroContainer) {
                      isScrolled = true;
                      heroContainer.style.height = '80px';
                      heroContainer.style.alignItems = 'center';
                      if (heroContent) heroContent.style.transform = 'scale(0.3)';
                      if (heroTitle) {
                        heroTitle.style.fontSize = '1.5rem';
                        heroTitle.style.marginBottom = '0';
                        heroTitle.style.transform = 'translateY(-10px)';
                      }
                      if (heroDescription) {
                        heroDescription.style.fontSize = '0.8rem';
                        heroDescription.style.marginBottom = '0';
                        heroDescription.style.transform = 'translateY(-5px)';
                      }
                      if (heroImage) {
                        heroImage.style.maxWidth = '60px';
                        heroImage.style.borderRadius = '0.5rem';
                      }
                    } else if (scrollY <= 100 && isScrolled && heroContainer) {
                      isScrolled = false;
                      heroContainer.style.height = '100vh';
                      heroContainer.style.alignItems = 'center';
                      if (heroContent) heroContent.style.transform = 'scale(1)';
                      if (heroTitle) {
                        heroTitle.style.fontSize = '4rem';
                        heroTitle.style.marginBottom = '1rem';
                        heroTitle.style.transform = 'translateY(0)';
                      }
                      if (heroDescription) {
                        heroDescription.style.fontSize = '1.5rem';
                        heroDescription.style.marginBottom = '2rem';
                        heroDescription.style.transform = 'translateY(0)';
                      }
                      if (heroImage) {
                        heroImage.style.maxWidth = '400px';
                        heroImage.style.borderRadius = '1rem';
                      }
                    }
                    
                    // Trigger section animations
                    const sections = document.querySelectorAll('.preview-section');
                    sections.forEach(section => {
                      const rect = section.getBoundingClientRect();
                      if (rect.top < window.innerHeight * 0.8) {
                        section.classList.add('visible');
                      }
                    });
                  }
                  
                  window.addEventListener('scroll', handleScroll);
                  
                  // Initial animation
                  window.addEventListener('load', () => {
                    setTimeout(() => {
                      const heroTitle = document.getElementById('previewHeroTitle');
                      const heroDescription = document.getElementById('previewHeroDescription');
                      const heroImage = document.getElementById('previewHeroImage');
                      
                      if (heroTitle) {
                        heroTitle.style.animation = 'fadeInUp 1s ease-out forwards';
                      }
                      if (heroDescription) {
                        heroDescription.style.animation = 'fadeInUp 1s ease-out 0.2s forwards';
                      }
                      if (heroImage) {
                        heroImage.style.animation = 'fadeInUp 1s ease-out 0.4s forwards';
                      }
                    }, 500);
                  });
                `
              }}
            />

            {/* Hero Section */}
            {sectionConfig.hero.enabled && (
              <section 
                className="hero-section"
                id="previewHeroContainer"
                style={{
                  background: `linear-gradient(135deg, ${styleConfig.colors.primary} 0%, ${styleConfig.colors.secondary} 100%)`,
                  fontFamily: styleConfig.typography.fontFamily,
                }}
              >
                <div className="hero-content" id="previewHeroContent">
                  <h1 
                    className="hero-title"
                    id="previewHeroTitle"
                    style={{
                      fontSize: styleConfig.typography.headingSize === 'large' ? '4rem' : 
                               styleConfig.typography.headingSize === 'medium' ? '3rem' : '2.5rem'
                    }}
                  >
                    {templateData.title}
                  </h1>
                  <p className="hero-description" id="previewHeroDescription">{templateData.description}</p>
                  {templateData.heroImage && (
                    <img 
                      src={templateData.heroImage} 
                      alt="Hero" 
                      className="hero-image"
                      id="previewHeroImage"
                    />
                  )}
                </div>
              </section>
            )}
            
            <div className="content-wrapper" style={{ backgroundColor: styleConfig.colors.background }}>
              {/* About Section */}
              {sectionConfig.about.enabled && (
                <section 
                  className="section bg-white preview-section"
                  style={{ fontFamily: styleConfig.typography.fontFamily }}
                >
                  <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                      <h2 
                        className="text-3xl font-bold mb-6"
                        style={{ 
                          color: styleConfig.colors.primary,
                          fontSize: styleConfig.typography.headingSize === 'large' ? '3rem' : 
                                   styleConfig.typography.headingSize === 'medium' ? '2.5rem' : '2rem'
                        }}
                      >
                        About {templateData.companyName}
                      </h2>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {templateData.aboutText}
                      </p>
                    </div>
                  </div>
                </section>
              )}
              
              {/* Features Section */}
              {sectionConfig.features.enabled && (
                <section 
                  className="section bg-white preview-section"
                  style={{ fontFamily: styleConfig.typography.fontFamily }}
                >
                  <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                      <h2 
                        className="text-3xl font-bold mb-8 text-center"
                        style={{ 
                          color: styleConfig.colors.primary,
                          fontSize: styleConfig.typography.headingSize === 'large' ? '3rem' : 
                                   styleConfig.typography.headingSize === 'medium' ? '2.5rem' : '2rem'
                        }}
                      >
                        Amazing Features
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-blue-50 rounded-lg">
                          <div className="text-4xl mb-4">🚀</div>
                          <h3 className="text-xl font-semibold mb-2">Fast Performance</h3>
                          <p className="text-gray-600">Lightning-fast loading times and smooth animations</p>
                        </div>
                        <div className="text-center p-6 bg-green-50 rounded-lg">
                          <div className="text-4xl mb-4">📱</div>
                          <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
                          <p className="text-gray-600">Perfect on all devices and screen sizes</p>
                        </div>
                        <div className="text-center p-6 bg-purple-50 rounded-lg">
                          <div className="text-4xl mb-4">✨</div>
                          <h3 className="text-xl font-semibold mb-2">Modern UI</h3>
                          <p className="text-gray-600">Beautiful, contemporary design that impresses</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
              
              {/* Contact Section */}
              {sectionConfig.contact.enabled && (
                <section 
                  className="section bg-gray-100 preview-section"
                  style={{ fontFamily: styleConfig.typography.fontFamily }}
                >
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                      <h2 
                        className="text-3xl font-bold mb-6"
                        style={{ 
                          color: styleConfig.colors.primary,
                          fontSize: styleConfig.typography.headingSize === 'large' ? '3rem' : 
                                   styleConfig.typography.headingSize === 'medium' ? '2.5rem' : '2rem'
                        }}
                      >
                        Get In Touch
                      </h2>
                      <div className="space-y-4">
                        <p className="text-lg">
                          <strong>Email:</strong> 
                          <a 
                            href={`mailto:${templateData.contactEmail}`} 
                            className="hover:underline ml-2"
                            style={{ color: styleConfig.colors.primary }}
                          >
                            {templateData.contactEmail}
                          </a>
                        </p>
                        {templateData.websiteUrl && (
                          <p className="text-lg">
                            <strong>Website:</strong> 
                            <a 
                              href={templateData.websiteUrl} 
                              className="hover:underline ml-2" 
                              target="_blank"
                              style={{ color: styleConfig.colors.primary }}
                            >
                              {templateData.websiteUrl}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              )}
              
              {/* Footer */}
              <footer className="section bg-gray-800 text-white">
                <div className="container mx-auto px-4 text-center">
                  <p>&copy; 2024 {templateData.companyName}. All rights reserved.</p>
                </div>
              </footer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
