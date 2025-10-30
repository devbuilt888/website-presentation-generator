'use client';

import { useState } from 'react';
import { saveAs } from 'file-saver';
import ImageUpload from './ImageUpload';
import TextInput from './TextInput';
import TemplatePreview from './TemplatePreview';
import AnimatedHero from './AnimatedHero';

interface TemplateData {
  title: string;
  description: string;
  heroImage?: string;
  aboutText: string;
  contactEmail: string;
  websiteUrl: string;
  companyName: string;
}

export default function TemplateBuilder() {
  const [templateData, setTemplateData] = useState<TemplateData>({
    title: '',
    description: '',
    heroImage: undefined,
    aboutText: '',
    contactEmail: '',
    websiteUrl: '',
    companyName: ''
  });

  const [activeTab, setActiveTab] = useState<'content' | 'preview'>('content');

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
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${templateData.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div class="container mx-auto px-4 text-center">
            <h1 class="text-5xl font-bold mb-4">${templateData.title}</h1>
            <p class="text-xl mb-8">${templateData.description}</p>
            ${templateData.heroImage ? `<img src="${templateData.heroImage}" alt="Hero" class="mx-auto rounded-lg shadow-lg max-w-md">` : ''}
        </div>
    </section>

    <!-- About Section -->
    <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto text-center">
                <h2 class="text-3xl font-bold mb-6">About ${templateData.companyName}</h2>
                <p class="text-lg text-gray-600 leading-relaxed">${templateData.aboutText}</p>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="py-16 bg-gray-100">
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
    <footer class="bg-gray-800 text-white py-8">
        <div class="container mx-auto px-4 text-center">
            <p>&copy; 2024 ${templateData.companyName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Animated Hero Demo */}
      {activeTab === 'preview' && (
        <AnimatedHero
          title={templateData.title}
          description={templateData.description}
          heroImage={templateData.heroImage}
        />
      )}

      {/* Header */}
      <header className={`bg-white shadow-sm border-b transition-all duration-300 ${
        activeTab === 'preview' ? 'mt-20' : ''
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Website Template Builder</h1>
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
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Live Preview
              </button>
            </div>
          </div>
          </div>
      </header>

      <div className={`container mx-auto px-4 py-8 transition-all duration-300 ${
        activeTab === 'preview' ? 'mt-20' : ''
      }`}>
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

          {/* Preview */}
          <div className="lg:sticky lg:top-8">
            <TemplatePreview
              templateData={templateData}
              onExport={handleExport}
            />
          </div>
        </div>

        {/* Live Preview Content Sections */}
        {activeTab === 'preview' && (
          <div className="space-y-8 mt-8">
            {/* About Section */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">About {templateData.companyName || 'Your Company'}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {templateData.aboutText || 'Tell your story here... This section will appear as you scroll down, creating a beautiful reveal effect.'}
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gray-100 rounded-lg shadow-sm p-8">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Get In Touch</h2>
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
            </section>

            {/* Features Section */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Amazing Features</h2>
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
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white rounded-lg shadow-sm p-8">
              <div className="text-center">
                <p>&copy; 2024 {templateData.companyName || 'Your Company'}. All rights reserved.</p>
                <p className="mt-2 text-gray-400">Built with the Website Template Builder</p>
              </div>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
