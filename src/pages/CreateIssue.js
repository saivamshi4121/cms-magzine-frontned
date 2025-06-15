import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../api';

const CreateIssue = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Validate required fields
    if (!formData.title.trim()) {
      setError('Title is required');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Creating issue at:', API.issues);
      console.log('With token:', token.substring(0, 10) + '...');
      
      const issueData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        month: parseInt(formData.month),
        year: parseInt(formData.year)
      };

      console.log('Sending issue data:', issueData);

      const response = await fetch(API.issues, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(issueData)
      });

      const responseData = await response.text();
      console.log('Raw response:', responseData);

      let data;
      try {
        data = JSON.parse(responseData);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Server returned invalid JSON');
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to create issue');
      }

      console.log('Issue created successfully:', data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating issue:', err);
      setError(err.message || 'Failed to create issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Issue</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field w-full"
            placeholder="Enter issue title"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field w-full h-32"
            placeholder="Enter issue description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Month
            </label>
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="input-field w-full"
              required
            >
              {months.map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Year
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="input-field w-full"
              required
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Creating...' : 'Create Issue'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateIssue;
