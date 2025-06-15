import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API, authHeader } from '../api';

const EditArticle = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    issueId: '',
    slug: '',
    status: 'draft'
  });
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch article data
        const articleResponse = await fetch(API.article(id), {
          headers: authHeader(token)
        });

        // Fetch issues for dropdown
        const issuesResponse = await fetch(API.issues, {
          headers: authHeader(token)
        });

        if (!articleResponse.ok || !issuesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [articleData, issuesData] = await Promise.all([
          articleResponse.json(),
          issuesResponse.json()
        ]);

        setIssues(issuesData);
        setFormData({
          ...articleData,
          tags: articleData.tags.join(', ')
        });
      } catch (err) {
        setError('Failed to load article data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Format tags as array
    const formattedData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(API.article(id), {
        method: 'PUT',
        headers: authHeader(token),
        body: JSON.stringify(formattedData)
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        const data = await response.json();
        setError(data.msg || 'Failed to update article');
      }
    } catch (err) {
      setError('Failed to update article');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container p-4 text-center">
        <div className="card p-8">
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <div className="max-w-2xl mx-auto">
        <div className="card p-4">
          <h1 className="text-xl font-bold mb-6">Edit Article</h1>

          {error && (
            <div className="bg-gray-100 text-gray-700 p-4 rounded mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-gray-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="form-input min-h-[200px]"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-input"
                placeholder="tech, news, featured"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="issueId" className="block text-gray-700 mb-2">
                Issue
              </label>
              <select
                id="issueId"
                name="issueId"
                value={formData.issueId}
                onChange={handleChange}
                className="form-input"
                required
                disabled={isLoading}
              >
                <option value="">Select an issue</option>
                {issues.map(issue => (
                  <option key={issue._id} value={issue._id}>
                    {issue.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
                required
                disabled={isLoading}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditArticle;
