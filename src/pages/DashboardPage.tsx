// Dashboard Page - Using Node.js Backend
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Activity } from '../types';
import { activitiesAPI, statsAPI } from '../services/api';
import EmissionStatsCards from '../components/EmissionStats';
import TrendChart from '../components/TrendChart';
import CategoryBreakdown from '../components/CategoryBreakdown';
import ActivityForm from '../components/ActivityForm';
import ActivityList from '../components/ActivityList';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    byCategory: { transport: 0, energy: 0, diet: 0, other: 0 },
  });
  const [trendData, setTrendData] = useState<{ date: string; emission: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    try {
      const [activitiesData, statsData, trend] = await Promise.all([
        activitiesAPI.getAll(),
        statsAPI.getStats(),
        statsAPI.getTrend(14),
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
      setTrendData(trend);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddActivity = async (data: {
    category: any;
    type: string;
    value: number;
    unit: string;
    date: string;
    notes: string;
  }) => {
    await activitiesAPI.create(data);
    fetchData(); // Refresh all data
  };

  const handleDeleteActivity = async (activityId: string) => {
    await activitiesAPI.delete(parseInt(activityId));
    fetchData(); // Refresh all data
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Welcome back, {user?.displayName || 'Eco Warrior'}! 👋</h1>
            <p>Track your carbon footprint and make a difference for our planet.</p>
          </div>
        </header>

        {/* Stats Overview */}
        <section className="dashboard-section">
          <EmissionStatsCards stats={stats} monthlyGoal={user?.monthlyGoal} />
        </section>

        {/* Charts Row */}
        <section className="dashboard-section charts-grid">
          <div className="chart-col">
            <TrendChart data={trendData} title="Last 14 Days Trend" />
          </div>
          <div className="chart-col">
            <CategoryBreakdown data={stats.byCategory as any} />
          </div>
        </section>

        {/* Activity Section */}
        <section className="dashboard-section activity-grid">
          <div className="activity-col">
            <h2 className="section-title">Log Activity</h2>
            <ActivityForm onSubmit={handleAddActivity} />
          </div>
          <div className="activity-col">
            <h2 className="section-title">Recent Activities</h2>
            <ActivityList 
              activities={activities.slice(0, 10)} 
              onDelete={handleDeleteActivity}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
