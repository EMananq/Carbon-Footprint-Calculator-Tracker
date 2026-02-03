// Navbar Component - Updated for Node.js Backend
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🌍</span>
          <span className="brand-text">EcoTrack</span>
        </Link>

        {user ? (
          <>
            <div className="navbar-links">
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/activities" 
                className={`nav-link ${isActive('/activities') ? 'active' : ''}`}
              >
                Activities
              </Link>
              <Link 
                to="/recommendations" 
                className={`nav-link ${isActive('/recommendations') ? 'active' : ''}`}
              >
                AI Advisor
              </Link>
              <Link 
                to="/profile" 
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              >
                Profile
              </Link>
            </div>

            <div className="navbar-actions">
              <span className="user-email">{user.email}</span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="navbar-actions">
            <Link to="/login" className="btn btn-secondary btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
