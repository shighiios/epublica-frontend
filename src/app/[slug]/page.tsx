'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getStoryblokApi } from '@storyblok/react';
import Link from 'next/link';

export default function ArticlePage() {
  const { slug } = useParams();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const storyblokApi = getStoryblokApi();
        if (!storyblokApi) {
          throw new Error('Storyblok API not initialized');
        }

        const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
          version: 'draft',
        });

        setContent(data.story.content);
      } catch (err: any) {
        console.error('Error loading article:', err);
        setError(err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchStory();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-lg text-gray-600">Loading article...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-red-600 text-lg mb-4">Error: {error}</div>
            <Link 
              href="/" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-gray-600 text-lg mb-4">Article not found</div>
            <Link 
              href="/" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Newspaper Header */}
      <header className="bg-white border-b-4 border-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-black tracking-wider mb-2">ePUBLICA</h1>
            <p className="text-gray-600 text-sm uppercase tracking-wider">Your Daily Digital Newspaper</p>
            <p className="text-gray-500 text-xs mt-1">{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Back Navigation */}
          <div className="p-6 border-b border-gray-200">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to News
            </Link>
          </div>

          {/* Article Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-black mb-4 leading-tight">
              {content.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {content.summary}
            </p>
          </div>

          {/* Article Image */}
          {content.image?.filename && (
            <div className="w-full h-64 bg-gray-200 overflow-hidden">
              <img
                src={content.image.filename}
                alt={content.image.alt || 'Article image'}
                className="w-full h-full object-cover grayscale contrast-125 brightness-90"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-6">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed text-base">
                {content.body?.content?.[0]?.content?.[0]?.text || 'No content available'}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Published on ePublica</span>
                <span>Article ID: {slug}</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
