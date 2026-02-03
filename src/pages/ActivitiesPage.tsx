// Activities Page - Using Node.js Backend
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Activity, ActivityCategory } from '../types';
import { activitiesAPI } from '../services/api';
import { formatEmission } from '../utils/emissionCalculator';
import ActivityForm from '../components/ActivityForm';
import ActivityList from '../components/ActivityList';
import './ActivitiesPage.css';

export default function ActivitiesPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const fetchActivities = async () => {
    try {
      const data = await activitiesAPI.getAll();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleAddActivity = async (data: {
    category: ActivityCategory;
    type: string;
    value: number;
    unit: string;
    date: string;
    notes: string;
  }) => {
    await activitiesAPI.create(data);
    fetchActivities();
    setShowForm(false);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleUpdateActivity = async (data: {
    category: ActivityCategory;
    type: string;
    value: number;
    unit: string;
    date: string;
    notes: string;
  }) => {
    if (!editingActivity) return;
    await activitiesAPI.update(parseInt(editingActivity.id), data);
    setEditingActivity(null);
    setShowForm(false);
    fetchActivities();
  };

  const handleDeleteActivity = async (activityId: string) => {
    await activitiesAPI.delete(parseInt(activityId));
    fetchActivities();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  const totalEmissions = activities.reduce((sum, a) => sum + a.emission, 0);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading activities...</p>
      </div>
    );
  }

  return (
    <div className="activities-page">
      <div className="container">
        <header className="page-header">
          <div className="header-left">
            <h1>Activity History</h1>
            <p>View and manage all your logged activities</p>
          </div>
          <div className="header-right">
            <div className="total-summary">
              <span className="total-label">Total Emissions</span>
              <span className="total-value">{formatEmission(totalEmissions)}</span>
            </div>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Close Form' : '+ Add Activity'}
            </button>
          </div>
        </header>

        {showForm && (
          <section className="form-section">
            <ActivityForm 
              onSubmit={editingActivity ? handleUpdateActivity : handleAddActivity}
              initialData={editingActivity ? {
                category: editingActivity.category,
                type: editingActivity.type,
                value: editingActivity.value,
                date: editingActivity.date,
                notes: editingActivity.notes || '',
              } : undefined}
              onCancel={handleCancel}
            />
          </section>
        )}

        <section className="list-section">
          <ActivityList 
            activities={activities}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
          />
        </section>
      </div>
    </div>
  );
}
