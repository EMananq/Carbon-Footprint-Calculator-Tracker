// Profile Page - Using Node.js Backend
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatEmission } from '../utils/emissionCalculator';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateUserProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [goal, setGoal] = useState(user?.monthlyGoal?.toString() || '500');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      await updateUserProfile({
        displayName: name,
        monthlyGoal: parseInt(goal) || 500,
      });
      setMessage('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="profile-page">
      <div className="container">
        <header className="page-header">
          <h1>Profile Settings</h1>
          <p>Manage your account and preferences</p>
        </header>

        <div className="profile-grid">
          {/* Profile Card */}
          <section className="profile-card">
            <div className="profile-avatar">
              <span className="avatar-emoji">👤</span>
            </div>
            
            {message && (
              <div className={`profile-message ${message.includes('success') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            {editing ? (
              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">Display Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Monthly Goal (kg CO₂)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    min="50"
                    max="5000"
                  />
                  <span className="form-hint">
                    Average monthly footprint is around 300-600 kg CO₂
                  </span>
                </div>

                <div className="form-actions">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setEditing(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-info">
                <h2 className="profile-name">{user?.displayName || 'User'}</h2>
                <p className="profile-email">{user?.email}</p>
                
                <div className="profile-stats">
                  <div className="profile-stat">
                    <span className="stat-label">Monthly Goal</span>
                    <span className="stat-value">{formatEmission(user?.monthlyGoal || 500)}</span>
                  </div>
                  <div className="profile-stat">
                    <span className="stat-label">Member Since</span>
                    <span className="stat-value">
                      {user?.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : 'Unknown'
                      }
                    </span>
                  </div>
                </div>

                <button className="btn btn-secondary w-full" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              </div>
            )}
          </section>

          {/* Quick Stats */}
          <section className="info-section">
            <h3>About Carbon Footprint</h3>
            <div className="info-cards">
              <div className="info-card">
                <span className="info-icon">🌍</span>
                <h4>Global Average</h4>
                <p>The average global carbon footprint is about 4-5 tonnes per year (330-420 kg/month).</p>
              </div>

              <div className="info-card">
                <span className="info-icon">🎯</span>
                <h4>Target</h4>
                <p>To limit climate change, we need to reduce to about 2 tonnes per year (170 kg/month).</p>
              </div>

              <div className="info-card">
                <span className="info-icon">💡</span>
                <h4>Every Bit Helps</h4>
                <p>Small changes add up. Tracking your emissions is the first step to reducing them!</p>
              </div>
            </div>
          </section>
        </div>

        {/* Danger Zone */}
        <section className="danger-zone">
          <h3>Account Actions</h3>
          <div className="danger-actions">
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
