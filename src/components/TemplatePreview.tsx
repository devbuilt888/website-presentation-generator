'use client';

import { useState } from 'react';
import { Download, Eye, Code } from 'lucide-react';

interface TemplateData {
  title: string;
  description: string;
  heroImage?: string;
  aboutText: string;
  contactEmail: string;
  websiteUrl: string;
  companyName: string;
}

interface TemplatePreviewProps {
  templateData: TemplateData;
  onExport: () => void;
}

export default function TemplatePreview({ templateData, onExport }: TemplatePreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const generateHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${templateData.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            overflow-x: hidden;
        }
        
        .hero-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        
        .hero-scrolled {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 80px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .hero-content-scrolled {
            text-align: center;
            color: white;
            transform: scale(0.3);
        }
        
        .hero-title-scrolled {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0;
            opacity: 0.9;
            transform: translateY(-10px);
        }
        
        .hero-description-scrolled {
            font-size: 0.8rem;
            margin: 0;
            opacity: 0.8;
            transform: translateY(-5px);
        }
        
        .hero-image-scrolled {
            max-width: 60px;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .content-wrapper {
            margin-top: 100vh;
            background: #f8fafc;
        }
        
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            animation: fadeInUp 1s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .section {
            padding: 4rem 1rem;
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
    <!-- Hero Section with Animation -->
    <div class="hero-container" id="heroContainer">
        <div class="hero-content" id="heroContent">
            <h1 class="hero-title" id="heroTitle">${templateData.title}</h1>
            <p class="hero-description" id="heroDescription">${templateData.description}</p>
            ${templateData.heroImage ? `<img src="${templateData.heroImage}" alt="Hero" class="hero-image" id="heroImage">` : ''}
        </div>
    </div>
    
    <div class="content-wrapper">
        <!-- About Section -->
        <section class="section bg-white" id="aboutSection">
            <div class="container mx-auto px-4">
                <div class="max-w-3xl mx-auto text-center">
                    <h2 class="text-3xl font-bold mb-6">About ${templateData.companyName}</h2>
                    <p class="text-lg text-gray-600 leading-relaxed">${templateData.aboutText}</p>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="section bg-gray-100" id="contactSection">
            <div class="container mx-auto px-4">
                <div class="max-w-2xl mx-auto text-center">
                    <h2 class="text-3xl font-bold mb-6">Get In Touch</h2>
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

        <!-- Footer -->
        <footer class="section bg-gray-800 text-white" id="footerSection">
            <div class="container mx-auto px-4 text-center">
                <p>&copy; 2024 ${templateData.companyName}. All rights reserved.</p>
            </div>
        </footer>
    </div>

    <script>
        let isScrolled = false;
        let animationStarted = false;
        
        function handleScroll() {
            const scrollY = window.scrollY;
            const heroContainer = document.getElementById('heroContainer');
            const heroContent = document.getElementById('heroContent');
            const heroTitle = document.getElementById('heroTitle');
            const heroDescription = document.getElementById('heroDescription');
            const heroImage = document.getElementById('heroImage');
            
            if (scrollY > 100 && !isScrolled) {
                // Start the transition
                isScrolled = true;
                heroContainer.style.height = '80px';
                heroContainer.style.alignItems = 'center';
                heroContent.style.transform = 'scale(0.3)';
                heroTitle.style.fontSize = '1.5rem';
                heroTitle.style.marginBottom = '0';
                heroTitle.style.transform = 'translateY(-10px)';
                heroDescription.style.fontSize = '0.8rem';
                heroDescription.style.marginBottom = '0';
                heroDescription.style.transform = 'translateY(-5px)';
                if (heroImage) {
                    heroImage.style.maxWidth = '60px';
                    heroImage.style.borderRadius = '0.5rem';
                }
            } else if (scrollY <= 100 && isScrolled) {
                // Reset to full screen
                isScrolled = false;
                heroContainer.style.height = '100vh';
                heroContainer.style.alignItems = 'center';
                heroContent.style.transform = 'scale(1)';
                heroTitle.style.fontSize = '4rem';
                heroTitle.style.marginBottom = '1rem';
                heroTitle.style.transform = 'translateY(0)';
                heroDescription.style.fontSize = '1.5rem';
                heroDescription.style.marginBottom = '2rem';
                heroDescription.style.transform = 'translateY(0)';
                if (heroImage) {
                    heroImage.style.maxWidth = '400px';
                    heroImage.style.borderRadius = '1rem';
                }
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
        
        // Initial animation
        window.addEventListener('load', () => {
            setTimeout(() => {
                const heroTitle = document.getElementById('heroTitle');
                const heroDescription = document.getElementById('heroDescription');
                const heroImage = document.getElementById('heroImage');
                
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
        
        window.addEventListener('scroll', handleScroll);
        
        // Smooth scroll for any internal links
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    </script>
</body>
</html>`;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Template Preview</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'preview'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'code'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Code size={16} />
            Code
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {viewMode === 'preview' ? (
          <div className="bg-white">
            {/* Hero Section with Animation Preview */}
            <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4 animate-pulse">
                    {templateData.title || 'Your Website Title'}
                  </h1>
                  <p className="text-lg mb-6">
                    {templateData.description || 'Your website description'}
                  </p>
                  {templateData.heroImage && (
                    <img 
                      src={templateData.heroImage} 
                      alt="Hero" 
                      className="mx-auto rounded-lg shadow-lg max-w-xs animate-bounce"
                    />
                  )}
                </div>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm opacity-70">
                ✨ Scroll to see the slide-up animation effect
              </div>
            </div>

            {/* About Section */}
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-3xl font-bold mb-6">About {templateData.companyName || 'Your Company'}</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {templateData.aboutText || 'Tell your story here...'}
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-gray-100">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
                  <div className="space-y-4">
                    <p className="text-lg">
                      <strong>Email:</strong> 
                      <a href={`mailto:${templateData.contactEmail}`} className="text-blue-600 hover:underline ml-2">
                        {templateData.contactEmail || 'your@email.com'}
                      </a>
                    </p>
                    {templateData.websiteUrl && (
                      <p className="text-lg">
                        <strong>Website:</strong> 
                        <a href={templateData.websiteUrl} className="text-blue-600 hover:underline ml-2" target="_blank">
                          {templateData.websiteUrl}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
              <div className="container mx-auto px-4 text-center">
                <p>&copy; 2024 {templateData.companyName || 'Your Company'}. All rights reserved.</p>
              </div>
            </footer>
          </div>
        ) : (
          <div className="bg-gray-900 text-green-400 p-4 overflow-auto max-h-96">
            <pre className="text-sm">
              <code>{generateHTML()}</code>
            </pre>
          </div>
        )}
      </div>

      <button
        onClick={onExport}
        className="mt-4 w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
      >
        <Download size={20} />
        Export Template
      </button>
    </div>
  );
}
