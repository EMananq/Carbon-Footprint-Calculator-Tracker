// Activity List Component
import { useState } from 'react';
import type { Activity } from '../types';
import { ACTIVITY_LABELS, CATEGORY_COLORS } from '../types';
import { formatEmission, formatDate } from '../utils/emissionCalculator';
import './ActivityList.css';

interface ActivityListProps {
  activities: Activity[];
  onEdit?: (activity: Activity) => void;
  onDelete?: (activityId: string) => void;
}

export default function ActivityList({ activities, onEdit, onDelete }: ActivityListProps) {
  const [filter, setFilter] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.category === filter);

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete?.(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transport': return '🚗';
      case 'energy': return '⚡';
      case 'diet': return '🍽️';
      default: return '📦';
    }
  };

  return (
    <div className="activity-list-container">
      {/* Filters */}
      <div className="list-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'transport' ? 'active' : ''}`}
          onClick={() => setFilter('transport')}
        >
          🚗 Transport
        </button>
        <button 
          className={`filter-btn ${filter === 'energy' ? 'active' : ''}`}
          onClick={() => setFilter('energy')}
        >
          ⚡ Energy
        </button>
        <button 
          className={`filter-btn ${filter === 'diet' ? 'active' : ''}`}
          onClick={() => setFilter('diet')}
        >
          🍽️ Diet
        </button>
      </div>

      {/* Activity List */}
      {filteredActivities.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <p>No activities logged yet</p>
          <span className="empty-hint">Start tracking your carbon footprint!</span>
        </div>
      ) : (
        <div className="activity-items">
          {filteredActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="activity-item"
              style={{ borderLeftColor: CATEGORY_COLORS[activity.category] }}
            >
              <div className="activity-icon">
                {getCategoryIcon(activity.category)}
              </div>
              
              <div className="activity-details">
                <div className="activity-title">
                  {ACTIVITY_LABELS[activity.type] || activity.type}
                </div>
                <div className="activity-meta">
                  {activity.value} {activity.unit} • {formatDate(activity.date)}
                </div>
                {activity.notes && (
                  <div className="activity-notes">{activity.notes}</div>
                )}
              </div>

              <div className="activity-emission">
                <span className="emission-value">{formatEmission(activity.emission)}</span>
                <span className="emission-label">CO₂</span>
              </div>

              <div className="activity-actions">
                {onEdit && (
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => onEdit(activity)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                )}
                {onDelete && (
                  <button 
                    className={`action-btn delete-btn ${deleteConfirm === activity.id ? 'confirm' : ''}`}
                    onClick={() => handleDelete(activity.id)}
                    title={deleteConfirm === activity.id ? 'Click again to confirm' : 'Delete'}
                  >
                    {deleteConfirm === activity.id ? '✓' : '🗑️'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
