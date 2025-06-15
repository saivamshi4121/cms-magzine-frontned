import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API } from '../api';

const ArticleView = () => {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(API.article(id), {
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }

        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container p-4 text-center">
        <div className="card p-8">
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container p-4">
        <div className="card p-4">
          <p className="text-gray-700">{error || 'Article not found'}</p>
          <Link to="/dashboard" className="btn mt-4">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <div className="max-w-2xl mx-auto">
        <div className="card p-4">
          <article>
            <header className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
              <div className="text-gray-600">
                By {article.author} · Published{' '}
                {new Date(article.createdAt).toLocaleDateString()}
              </div>
              {article.tags.length > 0 && (
                <div className="mt-2 flex gap-2">
                  {article.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div className="prose max-w-none mb-6">
              {/* Render content as HTML - Note: Content should be sanitized on the server */}
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            <footer className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Link to={`/issues/${article.issueId}`} className="btn">
                  Back to Issue
                </Link>
                <Link to="/dashboard" className="btn">
                  Back to Dashboard
                </Link>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;
