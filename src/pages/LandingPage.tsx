// Landing Page
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LandingPage.css';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Track Your Carbon Footprint,
              <span className="gradient-text"> Save The Planet</span>
            </h1>
            <p className="hero-subtitle">
              Join thousands of people making a difference. Calculate your emissions,
              get personalized AI recommendations, and take action for a greener future.
            </p>
            <div className="hero-cta">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-lg">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">🌍</div>
            <div className="floating-card card-2">📊</div>
            <div className="floating-card card-3">🌱</div>
            <div className="earth-glow"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-heading">
            Everything You Need to <span className="gradient-text">Go Green</span>
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">📝</span>
              <h3>Easy Activity Logging</h3>
              <p>Log your daily activities with just a few clicks. Track transportation, energy usage, and diet effortlessly.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📈</span>
              <h3>Visual Analytics</h3>
              <p>See your carbon footprint trends with beautiful charts. Understand your impact at a glance.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🤖</span>
              <h3>AI-Powered Advice</h3>
              <p>Get personalized recommendations from our AI advisor to effectively reduce your emissions.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🎯</span>
              <h3>Goal Tracking</h3>
              <p>Set monthly carbon goals and track your progress. Challenge yourself to do better each month.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact">
        <div className="container">
          <div className="impact-grid">
            <div className="impact-stat">
              <span className="impact-number">4.5+</span>
              <span className="impact-label">Tonnes CO₂ per person/year (global avg)</span>
            </div>
            <div className="impact-stat">
              <span className="impact-number">2</span>
              <span className="impact-label">Tonnes CO₂ target for climate safety</span>
            </div>
            <div className="impact-stat">
              <span className="impact-number">55%</span>
              <span className="impact-label">Reduction needed to hit targets</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Start Your Green Journey Today</h2>
            <p>Join EcoTrack and take the first step towards a sustainable future. It's free!</p>
            {!user && (
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="brand-icon">🌍</span>
              <span className="brand-name">EcoTrack</span>
            </div>
            <p className="footer-text">
              Built with 💚 for a greener planet | Carbon Footprint Calculator & Tracker
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
