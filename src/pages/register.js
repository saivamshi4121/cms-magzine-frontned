import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API, authHeader } from '../api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'writer' // Default role
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(API.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful - redirect to login
        navigate('/login');
      } else {
        setError(data.msg || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container min-h-screen flex items-center justify-center">
      <div className="card max-w-md w-full p-4">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Create Account</h2>
          <p className="text-gray-600">Join our magazine platform</p>
        </div>
        
        {error && (
          <div className="bg-gray-100 text-gray-700 p-4 rounded mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Choose a username"
              required
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Choose a password"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-gray-700 mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
              disabled={isLoading}
            >
              <option value="writer">Writer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-gray-700 font-bold">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
