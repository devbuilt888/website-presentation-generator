'use client';

import Link from 'next/link';
import { presentations } from '@/data/presentations';

export default function PresentationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Presentations</h1>
          <p className="text-lg text-gray-600">
            Manage and view your created presentations
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presentations.map((presentation) => (
            <Link
              key={presentation.id}
              href={`/presentations/${presentation.id}`}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">
                    {presentation.slides.length} slides
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {presentation.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {presentation.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Created {new Date(presentation.createdAt).toLocaleDateString()}
                  </span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
          
          {/* Add new presentation card */}
          <Link
            href="/editor"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-dashed border-gray-300 hover:border-blue-400 overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-700 group-hover:text-blue-600 transition-colors mb-2">
                Create New Presentation
              </h3>
              
              <p className="text-gray-500">
                Start building your next presentation
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
