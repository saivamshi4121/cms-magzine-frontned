import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { API } from '../api';

const Login = () => {
  const { setIsAuthenticated, setUser } = useOutletContext();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
      const response = await fetch(API.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        const userData = JSON.parse(atob(data.token.split('.')[1]));
        setUser(userData.user);
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError(data.msg || 'Login failed. Please check your credentials.');
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
          <h2 className="text-xl font-bold">Welcome Back</h2>
          <p className="text-gray-600">Sign in to manage your magazine content</p>
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
              placeholder="Enter your username"
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
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-gray-700 font-bold">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
