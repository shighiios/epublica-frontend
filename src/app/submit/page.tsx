'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SubmitPage() {
  const [msg, setMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg('');

    try {
      const res = await fetch('/api/submit-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submitterName: e.target.submitterName.value,
          articleContent: e.target.articleContent.value,
          imageUrl: e.target.imageUrl.value || null,
        }),
      });

      if (res.ok) {
        setMsg('✅ Article submitted successfully! It will be reviewed and published soon.');
        e.target.reset();
      } else {
        const errorData = await res.json();
        setMsg(`❌ Submission failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setMsg('❌ Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8 form-container">
            <h2 className="text-3xl font-bold text-black mb-2">Submit New Article</h2>
            <p className="text-gray-600">Share your story with the ePublica community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 form-container">
            <div>
              <label htmlFor="submitterName" className="block text-sm font-bold text-gray-900 mb-2">
                Your Name *
              </label>
              <input
                id="submitterName"
                name="submitterName"
                type="text"
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              />
            </div>

            <div>
              <label htmlFor="articleContent" className="block text-sm font-bold text-gray-900 mb-2">
                Article Content *
              </label>
              <textarea
                id="articleContent"
                name="articleContent"
                placeholder="Write your full article content here... The AI will automatically extract the title and summary from your content."
                rows={12}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 Tip: Start your article with a clear title and include a brief summary in the first paragraph.
              </p>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-bold text-gray-900 mb-2">
                Image URL (optional)
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                Add an image URL to accompany your article (optional)
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Article'}
              </button>
              <Link
                href="/"
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium"
              >
                Back to News
              </Link>
            </div>

            {msg && (
              <div className={`p-4 rounded-lg border-2 ${
                msg.includes('✅') 
                  ? 'bg-green-50 text-green-800 border-green-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                {msg}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
