import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API, authHeader } from '../api';

const IssuePage = () => {
  const [issue, setIssue] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await fetch(`${API.issues}/${id}`, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch issue');
        }

        const data = await response.json();
        setIssue(data);
        
        // Fetch published articles for this issue
        const articlesResponse = await fetch(`${API.issues}/${id}/articles`, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (articlesResponse.ok) {
          const articlesData = await articlesResponse.json();
          setArticles(articlesData.filter(article => article.status === 'published'));
        }
      } catch (err) {
        setError('Failed to load issue data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container p-4 text-center">
        <div className="card p-8">
          <p className="text-gray-600">Loading issue...</p>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="container p-4">
        <div className="card p-4">
          <p className="text-gray-700">{error || 'Issue not found'}</p>
          <Link to="/dashboard" className="btn mt-4">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <div className="card p-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-2">{issue.title}</h1>
          <p className="text-gray-600">
            Published on {new Date(issue.publishDate).toLocaleDateString()}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Articles in this Issue</h2>
          {articles.length === 0 ? (
            <p className="text-gray-600">No published articles in this issue.</p>
          ) : (
            <div className="space-y-4">
              {articles.map(article => (
                <div key={article._id} className="p-4 bg-gray-100 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{article.title}</h3>
                      <p className="text-gray-600">
                        By {article.author} · {article.tags.join(', ')}
                      </p>
                    </div>
                    <Link 
                      to={`/articles/${article._id}`}
                      className="btn"
                    >
                      Read Article
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link to="/dashboard" className="btn">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default IssuePage;
