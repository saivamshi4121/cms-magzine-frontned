import { createBrowserRouter, Navigate, useOutletContext } from 'react-router-dom';
import App from './app';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import CreateArticle from './pages/CreateArticle';
import EditArticle from './pages/EditArticle';
import IssuePage from './pages/IssuePage';
import ArticleView from './pages/ArticleView';
import CreateIssue from './pages/CreateIssue';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useOutletContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'issues/new',
        element: (
          <ProtectedRoute>
            <CreateIssue />
          </ProtectedRoute>
        ),
      },
      {
        path: 'articles/new',
        element: (
          <ProtectedRoute>
            <CreateArticle />
          </ProtectedRoute>
        ),
      },
      {
        path: 'articles/:id/edit',
        element: (
          <ProtectedRoute>
            <EditArticle />
          </ProtectedRoute>
        ),
      },
      {
        path: 'articles/:id',
        element: <ArticleView />
      },
      {
        path: 'issues/:id',
        element: <IssuePage />
      }
    ]
  }
]);
