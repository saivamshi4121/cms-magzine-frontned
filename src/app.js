import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split('.')[1]));
        if (userData.exp * 1000 > Date.now()) {
          setUser(userData.user);
          setIsAuthenticated(true);
        } else {
          // Token expired
          handleLogout();
        }
      } catch (e) {
        // Invalid token
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white p-4 mb-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            CMS Magazine
          </Link>
          <div>
            {isAuthenticated ? (
              <div className="flex items-center">
                <Link to="/dashboard" className="btn mr-4">
                  Dashboard
                </Link>
                <span className="mr-4">Welcome, {user?.username}</span>
                <button onClick={handleLogout} className="btn btn-primary">
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <Link to="/login" className="btn btn-primary mr-2">
                  Login
                </Link>
                <Link to="/register" className="btn">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main>
        <Outlet context={{ isAuthenticated, setIsAuthenticated, user, setUser }} />
      </main>
    </div>
  );
}

export default App;
