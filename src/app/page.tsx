'use client';

import { useEffect, useState } from 'react';
import { getStoryblokApi } from '@storyblok/react';
import Link from 'next/link';

type Article = {
  name: string;
  full_slug: string;
  published_at: string;
  content: {
    title: string;
    summary: string;
    image?: {
      filename: string;
      alt?: string;
    };
    body?: {
      content?: Array<{
        content?: Array<{
          text?: string;
        }>;
      }>;
    };
    author_name?: string;
  };
};

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Helper function to format publication date and time
  const formatPublicationDate = (publishedAt: string) => {
    try {
      const date = new Date(publishedAt);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 24) {
        // Show time if published today
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
      } else if (diffInHours < 48) {
        // Show "Yesterday" if published yesterday
        return 'Yesterday';
      } else {
        // Show date for older articles
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      return 'Unknown';
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const storyblokApi = getStoryblokApi();
        if (!storyblokApi) {
          throw new Error('Storyblok API not initialized');
        }

        const { data } = await storyblokApi.get('cdn/stories', {
          version: 'draft',
          starts_with: '',
        });

        const filtered = data.stories.filter(
          (story: any) => story.content.component === 'article'
        );

        // Sort articles by publication date (most recent first)
        const sorted = filtered.sort((a: any, b: any) => {
          const dateA = new Date(a.published_at || a.created_at || 0);
          const dateB = new Date(b.published_at || b.created_at || 0);
          return dateB.getTime() - dateA.getTime();
        });

        setArticles(sorted);
        // Set the first article as selected by default
        if (sorted.length > 0) {
          setSelectedArticle(sorted[0]);
        }
      } catch (err: any) {
        console.error('Failed to fetch articles:', err);
        setError(err.message || 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50">
        {/* Newspaper Header */}
        <header className="bg-gray-900 border-b-4 border-gray-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white tracking-wider mb-2 font-serif">ePUBLICA</h1>
              <p className="text-white text-sm uppercase tracking-wider font-serif">Your Daily Digital Newspaper</p>
              <p className="text-gray-300 text-xs mt-1 font-serif">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </header>

        {/* Main Newspaper Layout - Side by Side */}
        <div className="max-w-7xl mx-auto px-8 py-8" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
          <div className="flex bg-white rounded-lg p-8 shadow-lg" style={{ height: 'calc(100vh - 200px)' }}>
            
            {/* Left Side - Dashboard */}
            <div className="w-[425px] flex-shrink-0">
              <div className="bg-amber-50 rounded-lg shadow-lg p-6 h-full overflow-y-auto dashboard-scroll" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-600 pb-2 font-serif px-4" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                  Latest Headlines
                </h2>
                
                {/* Submit New Article Button - Moved to top */}
                <div className="mb-6 px-4" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                  <div 
                    className="news-card cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-gray-300"
                    style={{ 
                      border: '1px solid #e5e7eb',
                      borderRadius: '0px',
                      backgroundColor: '#fef7e0',
                      marginBottom: '12px'
                    }}
                  >
                    <Link 
                      href="/submit" 
                      className="block p-4" 
                      style={{ padding: '8px' }}
                    >
                      <div className="text-center">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 font-serif" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                          Submit New Article
                        </h3>
                        <p className="text-gray-600 text-xs leading-relaxed font-serif mb-3" style={{ fontSize: '11px', lineHeight: '1.5' }}>
                          Share your story with the ePublica community
                        </p>
                        <div className="bg-gray-800 text-white py-2 px-3 rounded text-xs font-bold font-serif inline-block">
                          + Add Article
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                
                <div className="space-y-0 mb-6 px-4" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                  {articles.map((article, index) => (
                    <div key={article.full_slug}>
                      <div
                        className={`news-card cursor-pointer transition-all duration-200 ${
                          selectedArticle?.full_slug === article.full_slug
                            ? 'selected border-l-4 border-blue-600 shadow-md'
                            : 'border-l-4 border-transparent hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedArticle(article)}
                        style={{ 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0px',
                          backgroundColor: selectedArticle?.full_slug === article.full_slug ? '#fde68a' : '#fef7e0',
                          marginBottom: '12px'
                        }}
                      >
                        <div className="p-4" style={{ padding: '8px' }}>
                          {/* Article Meta */}
                          <div className="flex justify-between items-start mb-3">
                            <div className="text-xs text-gray-400 font-serif">
                              {article.content.author_name ? 'By ' + article.content.author_name : 'Anonymous'}
                            </div>
                            <div className="text-xs text-gray-400 font-serif">
                              {formatPublicationDate(article.published_at)}
                            </div>
                          </div>
                          
                          {/* Article Title */}
                          <h3 className="font-bold text-gray-900 text-sm leading-tight mb-4 font-serif" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                            {article.content.title}
                          </h3>
                          
                          {/* Article Summary */}
                          <p className="text-gray-600 text-xs leading-relaxed font-serif mb-3" style={{ fontSize: '11px', lineHeight: '1.5' }}>
                            {article.content.summary}
                          </p>
                        </div>
                      </div>
                      
                      {/* Separator - centered between news items */}
                      {index < articles.length - 1 && (
                        <div className="h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 mx-2" style={{ marginTop: '6px', marginBottom: '6px' }}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="w-4 bg-gray-600 mx-12" style={{ marginLeft: '50px', marginRight: '50px', border: '2px solid black' }}></div>

            {/* Right Side - News Feed */}
            <div className="flex-1">
              <div className="bg-amber-50 rounded-lg shadow-lg p-8 text-center h-full overflow-y-auto mx-8 newsfeed-scroll" style={{ marginLeft: '40px', marginRight: '40px' }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Loading Content</h2>
                <p className="text-gray-600 font-serif">Please wait while we load the latest articles.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-amber-50">
        <div className="text-red-600 text-lg mb-4 font-serif">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 font-serif"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-8 bg-amber-50">
        <h2 className="text-2xl font-bold mb-4 font-serif">No Articles Yet</h2>
        <p className="text-gray-600 mb-6 font-serif">Be the first to submit an article!</p>
        <Link 
          href="/submit" 
          className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors font-serif"
        >
          Submit Article
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Newspaper Header */}
      <header className="bg-gray-900 border-b-4 border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white tracking-wider mb-2 font-serif">ePUBLICA</h1>
            <p className="text-white text-sm uppercase tracking-wider font-serif">Your Daily Digital Newspaper</p>
            <p className="text-gray-300 text-xs mt-1 font-serif">{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>
      </header>

      {/* Main Newspaper Layout - Side by Side */}
      <div className="max-w-7xl mx-auto px-8 py-8" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
        <div className="flex bg-white rounded-lg p-8 shadow-lg" style={{ height: 'calc(100vh - 200px)' }}>
          
          {/* Left Side - Dashboard */}
          <div className="w-[425px] flex-shrink-0">
            <div className="bg-amber-50 rounded-lg shadow-lg p-6 h-full overflow-y-auto dashboard-scroll" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-600 pb-2 font-serif px-4" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                Latest Headlines
              </h2>
              
              {/* Submit New Article Button - Moved to top */}
              <div className="mb-6 px-4" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <div 
                  className="news-card cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-gray-300"
                  style={{ 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0px',
                    backgroundColor: '#fef7e0',
                    marginBottom: '12px'
                  }}
                >
                  <Link 
                    href="/submit" 
                    className="block p-4" 
                    style={{ padding: '8px' }}
                  >
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 font-serif" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                        Submit New Article
                      </h3>
                      <p className="text-gray-600 text-xs leading-relaxed font-serif mb-3" style={{ fontSize: '11px', lineHeight: '1.5' }}>
                        Share your story with the ePublica community
                      </p>
                      <div className="bg-gray-800 text-white py-2 px-3 rounded text-xs font-bold font-serif inline-block">
                        + Add Article
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              
              <div className="space-y-0 mb-6 px-4" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                {articles.map((article, index) => (
                  <div key={article.full_slug}>
                    <div
                      className={`news-card cursor-pointer transition-all duration-200 ${
                        selectedArticle?.full_slug === article.full_slug
                          ? 'selected border-l-4 border-blue-600 shadow-md'
                          : 'border-l-4 border-transparent hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedArticle(article)}
                      style={{ 
                        border: '1px solid #e5e7eb',
                        borderRadius: '0px',
                        backgroundColor: selectedArticle?.full_slug === article.full_slug ? '#fde68a' : '#fef7e0',
                        marginBottom: '12px'
                      }}
                    >
                      <div className="p-4" style={{ padding: '8px' }}>
                        {/* Article Meta */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-xs text-gray-400 font-serif">
                            {article.content.author_name ? 'By ' + article.content.author_name : 'Anonymous'}
                          </div>
                          <div className="text-xs text-gray-400 font-serif">
                            {formatPublicationDate(article.published_at)}
                          </div>
                        </div>
                        
                        {/* Article Title */}
                        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-4 font-serif" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                          {article.content.title}
                        </h3>
                        
                        {/* Article Summary */}
                        <p className="text-gray-600 text-xs leading-relaxed font-serif mb-3" style={{ fontSize: '11px', lineHeight: '1.5' }}>
                          {article.content.summary}
                        </p>
                      </div>
                    </div>
                    
                    {/* Separator - centered between news items */}
                    {index < articles.length - 1 && (
                      <div className="h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 mx-2" style={{ marginTop: '6px', marginBottom: '6px' }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="w-4 bg-gray-600 mx-12" style={{ marginLeft: '50px', marginRight: '50px', border: '2px solid black' }}></div>

          {/* Right Side - News Feed */}
          <div className="flex-1">
            {selectedArticle ? (
              <div className="bg-amber-50 rounded-lg shadow-lg h-full overflow-hidden">
                {/* Article Header */}
                <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-400">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight font-serif">
                    {selectedArticle.content.title}
                  </h1>
                </div>

                {/* Article Content */}
                <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto h-full" style={{ height: 'calc(100% - 80px)' }}>
                  {/* Article text and image layout */}
                  <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 news-feed-layout">
                    {/* Article text content */}
                    <div className="flex-1 news-feed-text">
                      <div className="text-gray-800 leading-relaxed text-sm sm:text-base lg:text-lg font-serif mb-6">
                        {selectedArticle.content.body?.content?.[0]?.content?.[0]?.text || 
                         'Article content will be displayed here when available.'}
                      </div>
                    </div>
                    
                    {/* Article Image - responsive positioning with padding */}
                    {selectedArticle.content.image?.filename && (
                      <div className="w-full lg:w-80 lg:flex-shrink-0 bg-white rounded-lg shadow-md border border-gray-200 news-feed-image" style={{ marginLeft: '20px' }}>
                        <img
                          src={selectedArticle.content.image.filename}
                          alt={selectedArticle.content.image.alt || 'Article image'}
                          className="w-full h-auto object-contain rounded-lg grayscale contrast-125 brightness-90"
                          style={{ maxHeight: '300px' }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Footer - only "Published on ePublica" */}
                  <div className="mt-6 pt-4 border-t border-gray-400">
                    <div className="text-sm text-gray-500 font-serif pt-4">
                      <span>Published on ePublica</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-center h-full overflow-y-auto newsfeed-scroll">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 font-serif">Select an Article</h2>
                <p className="text-gray-600 font-serif text-sm sm:text-base">Choose an article from the left sidebar to read the full story.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
