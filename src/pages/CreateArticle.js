import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API, authHeader } from '../api';

const CreateArticle = () => {  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    issueId: '',
    slug: '',
    status: 'draft'
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        console.log('Fetching issues from:', API.issues);
        const response = await fetch(API.issues, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch issues: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched issues:', data);
        setIssues(data);
      } catch (err) {
        console.error('Error fetching issues:', err);
        setError('Failed to load issues: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Validate required fields
    if (!formData.title.trim()) {
      setError('Title is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      setIsSubmitting(false);
      return;
    }

    try {
      // First create the article
      const articleData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        status: formData.status || 'draft',
        issue: formData.issueId || null,
        slug: formData.slug.trim() || formData.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
      };

      console.log('Creating article with data:', articleData);

      const response = await fetch(API.articles, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create article' }));
        throw new Error(errorData.message || 'Failed to create article');
      }

      const data = await response.json();
      console.log('Article created:', data);

      // If we have an image, upload it separately
      if (image && data._id) {
        const imageFormData = new FormData();
        imageFormData.append('image', image);

        const imageResponse = await fetch(`${API.articles}/${data._id}/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: imageFormData
        });

        if (!imageResponse.ok) {
          console.warn('Image upload failed, but article was created');
        }
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating article:', err);
      setError(err.message || 'Failed to create article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container p-4 text-center">
        <div className="card p-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <div className="max-w-2xl mx-auto">
        <div className="card p-4">
          <h1 className="text-xl font-bold mb-6">Create New Article</h1>

          {error && (
            <div className="bg-gray-100 text-gray-700 p-4 rounded mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
                disabled={isSubmitting}
                placeholder="Enter article title"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="form-input"
                required
                disabled={isSubmitting}
                placeholder="article-url-slug"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="form-input min-h-[200px]"
                required
                disabled={isSubmitting}
                placeholder="Write your article content here..."
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
                disabled={isSubmitting}
                placeholder="tech, news, featured"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-gray-700 mb-2">
                Featured Image
              </label>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                className="form-input"
                accept="image/*"
                disabled={isSubmitting}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs rounded border border-gray-200"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="issueId" className="block text-gray-700 mb-2">
                Issue *
              </label>
              <select
                id="issueId"
                name="issueId"
                value={formData.issueId}
                onChange={handleChange}
                className="form-input"
                required
                disabled={isSubmitting}
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
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
                required
                disabled={isSubmitting}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Article'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
