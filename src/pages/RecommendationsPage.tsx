// Recommendations Page - Using Node.js Backend
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Activity } from '../types';
import { activitiesAPI, statsAPI } from '../services/api';
import { getRecommendations } from '../services/aiService';
import AIChatbot from '../components/AIChatbot';
import './RecommendationsPage.css';

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    byCategory: { transport: 0, energy: 0, diet: 0, other: 0 },
  });
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesData, statsData] = await Promise.all([
          activitiesAPI.getAll(),
          statsAPI.getStats(),
        ]);
        setActivities(activitiesData);
        setStats({
          daily: statsData.daily,
          weekly: statsData.weekly,
          monthly: statsData.monthly,
          byCategory: {
            transport: statsData.byCategory?.transport || 0,
            energy: statsData.byCategory?.energy || 0,
            diet: statsData.byCategory?.diet || 0,
            other: statsData.byCategory?.other || 0,
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchRecommendations() {
      if (loading) return;
      
      setLoadingRecs(true);
      const recs = await getRecommendations(stats as any, activities);
      setRecommendations(recs);
      setLoadingRecs(false);
    }

    fetchRecommendations();
  }, [stats, loading]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading recommendations...</p>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <div className="container">
        <header className="page-header">
          <h1>AI Carbon Advisor 🌱</h1>
          <p>Get personalized recommendations to reduce your carbon footprint</p>
        </header>

        <div className="recommendations-grid">
          {/* AI Recommendations */}
          <section className="recommendations-section">
            <h2>Personalized Tips</h2>
            <div className="recommendations-list">
              {loadingRecs ? (
                <div className="loading-recs">
                  <div className="spinner"></div>
                  <p>Analyzing your data...</p>
                </div>
              ) : recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-card">
                    <span className="rec-number">{index + 1}</span>
                    <p>{rec}</p>
                  </div>
                ))
              ) : (
                <div className="no-recs">
                  <span className="empty-icon">💡</span>
                  <p>Start logging activities to get personalized recommendations!</p>
                </div>
              )}
            </div>
          </section>

          {/* AI Chatbot */}
          <section className="chatbot-section">
            <h2>Ask EcoBot</h2>
            <AIChatbot stats={stats as any} />
          </section>
        </div>

        {/* Tips Section */}
        <section className="tips-section">
          <h2>Quick Tips by Category</h2>
          <div className="tips-grid">
            <div className="tip-card transport">
              <span className="tip-icon">🚗</span>
              <h3>Transportation</h3>
              <ul>
                <li>Use public transport instead of driving alone</li>
                <li>Walk or cycle for short distances</li>
                <li>Consider carpooling for commutes</li>
                <li>Take trains instead of short flights</li>
              </ul>
            </div>

            <div className="tip-card energy">
              <span className="tip-icon">⚡</span>
              <h3>Energy</h3>
              <ul>
                <li>Switch to LED light bulbs</li>
                <li>Unplug devices when not in use</li>
                <li>Use a programmable thermostat</li>
                <li>Consider renewable energy options</li>
              </ul>
            </div>

            <div className="tip-card diet">
              <span className="tip-icon">🍽️</span>
              <h3>Diet</h3>
              <ul>
                <li>Try meat-free days each week</li>
                <li>Buy local and seasonal produce</li>
                <li>Reduce food waste by planning meals</li>
                <li>Choose plant-based alternatives</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
