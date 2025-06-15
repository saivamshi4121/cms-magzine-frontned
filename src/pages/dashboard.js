import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { API, authHeader } from '../api';

const DashboardAnalytics = ({ articles, issues }) => {
  const publishedArticles = articles.filter(article => article.status === 'published');
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="card p-4 text-center">
        <h3 className="text-sm text-gray-600">Total Articles</h3>
        <p className="text-2xl font-bold">{articles.length}</p>
      </div>
      <div className="card p-4 text-center">
        <h3 className="text-sm text-gray-600">Published</h3>
        <p className="text-2xl font-bold">{publishedArticles.length}</p>
      </div>
      <div className="card p-4 text-center">
        <h3 className="text-sm text-gray-600">Draft</h3>
        <p className="text-2xl font-bold">{articles.length - publishedArticles.length}</p>
      </div>
      <div className="card p-4 text-center">
        <h3 className="text-sm text-gray-600">Issues</h3>
        <p className="text-2xl font-bold">{issues.length}</p>
      </div>
    </div>
  );
};

const ArticlesList = ({ articles, onDelete, onStatusChange, isAdmin, currentUser }) => {
  return (
    <div className="space-y-4">
      {articles.map(article => (
        <div key={article._id} className="card p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">{article.title}</h3>
              <p className="text-gray-600">
                {isAdmin && `By ${article.author} · `}
                Status: <span className={article.status === 'published' ? 'text-green-600' : 'text-gray-600'}>
                  {article.status}
                </span>
              </p>
              {article.tags?.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {article.tags.map(tag => (
                    <span key={tag} className="bg-white text-gray-600 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Link to={`/articles/${article._id}`} className="btn">
                View
              </Link>
              {(isAdmin || article.author === currentUser?.username) && (
                <>
                  <Link to={`/articles/${article._id}/edit`} className="btn">
                    Edit
                  </Link>
                  {isAdmin && (
                    <button
                      onClick={() => onStatusChange(article._id, article.status === 'published' ? 'draft' : 'published')}
                      className={`btn ${article.status === 'published' ? 'btn-primary' : 'btn'}`}
                    >
                      {article.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(article._id)}
                    className="btn btn-primary"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const IssuesList = ({ issues, onDelete, isAdmin }) => {
  return (
    <div className="space-y-4">
      {issues.map(issue => (
        <div key={issue._id} className="card p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">
                <Link to={`/issues/${issue._id}`} className="hover:text-primary">
                  {issue.title}
                </Link>
              </h3>
              <p className="text-gray-600 mt-1">{issue.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(issue.month + '/1/' + issue.year).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <Link
                  to={`/issues/${issue._id}/edit`}
                  className="btn-secondary btn-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(issue._id)}
                  className="btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useOutletContext();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        navigate('/login');
        return;
      }

      try {
        // Fetch data based on role
        const articlesUrl = user.role === 'writer' 
          ? `${API.articles}?userId=${user.id}`
          : API.articles;

        const [articlesResponse, issuesResponse] = await Promise.all([
          fetch(articlesUrl, { headers: authHeader(token) }),
          fetch(API.issues, { headers: authHeader(token) })
        ]);

        // Check for unauthorized responses
        if (articlesResponse.status === 401 || issuesResponse.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        // Check for other errors
        if (!articlesResponse.ok || !issuesResponse.ok) {
          const articlesError = await articlesResponse.text().catch(() => 'Unknown error');
          const issuesError = await issuesResponse.text().catch(() => 'Unknown error');
          throw new Error(`Failed to fetch data: ${articlesError} ${issuesError}`);
        }

        const [articlesData, issuesData] = await Promise.all([
          articlesResponse.json(),
          issuesResponse.json()
        ]);

        setArticles(articlesData);
        setIssues(issuesData);
        setError(''); // Clear any existing errors
      } catch (err) {
        setError('Unable to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, user]);

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(API.article(articleId), {
        method: 'DELETE',
        headers: authHeader(token)
      });

      if (response.ok) {
        setArticles(prev => prev.filter(article => article._id !== articleId));
      } else {
        setError('Failed to delete article');
      }
    } catch (err) {
      setError('Failed to delete article');
    }
  };

  const handleStatusChange = async (articleId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(API.article(articleId), {
        method: 'PATCH',
        headers: authHeader(token),
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setArticles(prev => prev.map(article => 
          article._id === articleId 
            ? { ...article, status: newStatus }
            : article
        ));
      } else {
        setError('Failed to update article status');
      }
    } catch (err) {
      setError('Failed to update article status');
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(API.issue(issueId), {
        method: 'DELETE',
        headers: authHeader(token)
      });

      if (response.ok) {
        setIssues(prev => prev.filter(issue => issue._id !== issueId));
      } else {
        throw new Error('Failed to delete issue');
      }
    } catch (err) {
      setError('Failed to delete issue');
    }
  };

  if (isLoading) {
    return (
      <div className="container p-4 text-center">
        <div className="card p-8">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4">
      {error && (
        <div className="bg-gray-100 text-gray-700 p-4 rounded mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">Welcome, {user?.username || 'User'}</h1>
          <p className="text-gray-600">
            You are logged in as: {user?.role || 'user'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/articles/new" className="btn btn-primary">
            Create New Article
          </Link>
          {user?.role === 'admin' && (
            <Link to="/issues/new" className="btn">
              Create Issue
            </Link>
          )}
        </div>
      </div>

      {/* Analytics Summary - Admin Only */}
      {user?.role === 'admin' && (
        <DashboardAnalytics 
          articles={articles}
          issues={issues}
        />
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Issues Section - Visible to All */}
        <div className="card p-4">
          <h2 className="text-lg font-bold mb-4">Magazine Issues</h2>
          {issues.length === 0 ? (
            <p className="text-gray-600">No issues available.</p>
          ) : (
            <div className="space-y-4">
              {issues.map(issue => (
                <div key={issue._id} className="p-4 bg-gray-100 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{issue.title}</h3>
                      <p className="text-gray-600">
                        {new Date(issue.publishDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        {issue.articles?.length || 0} articles
                      </p>
                    </div>
                    <Link to={`/issues/${issue._id}`} className="btn">
                      View Issue
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Articles Section */}
        <div className="card p-4">
          <h2 className="text-lg font-bold mb-4">
            {user?.role === 'admin' ? 'All Articles' : 'My Articles'}
          </h2>
          {articles.length === 0 ? (
            <p className="text-gray-600">
              {user?.role === 'admin' 
                ? 'No articles available.' 
                : 'You haven\'t created any articles yet.'}
            </p>
          ) : (
            <ArticlesList 
              articles={articles}
              onDelete={handleDeleteArticle}
              onStatusChange={handleStatusChange}
              isAdmin={user?.role === 'admin'}
              currentUser={user}
            />
          )}
        </div>
      </div>

      {/* Issues Management - Admin Only */}
      {user?.role === 'admin' && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Issues</h2>
            <Link to="/issues/new" className="btn-primary">
              Create New Issue
            </Link>
          </div>
          
          <IssuesList
            issues={issues}
            onDelete={handleDeleteIssue}
            isAdmin={user?.role === 'admin'}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
