// Emission Stats Component
import type { EmissionStats } from '../types';
import { formatEmission, getProgressToGoal } from '../utils/emissionCalculator';
import './EmissionStats.css';

interface EmissionStatsProps {
  stats: EmissionStats;
  monthlyGoal?: number;
}

export default function EmissionStatsCards({ stats, monthlyGoal = 500 }: EmissionStatsProps) {
  const progress = getProgressToGoal(stats.monthly, monthlyGoal);
  
  const getStatusColor = (status: 'good' | 'warning' | 'danger') => {
    switch (status) {
      case 'good': return 'var(--accent-green)';
      case 'warning': return 'var(--accent-orange)';
      case 'danger': return 'var(--accent-red)';
    }
  };

  return (
    <div className="emission-stats">
      {/* Daily */}
      <div className="stat-card">
        <div className="stat-icon">📅</div>
        <div className="stat-content">
          <span className="stat-value">{formatEmission(stats.daily)}</span>
          <span className="stat-label">Today</span>
        </div>
      </div>

      {/* Weekly */}
      <div className="stat-card">
        <div className="stat-icon">📆</div>
        <div className="stat-content">
          <span className="stat-value">{formatEmission(stats.weekly)}</span>
          <span className="stat-label">This Week</span>
        </div>
      </div>

      {/* Monthly */}
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <span className="stat-value">{formatEmission(stats.monthly)}</span>
          <span className="stat-label">This Month</span>
        </div>
      </div>

      {/* Goal Progress */}
      <div className="stat-card goal-card">
        <div className="stat-icon">🎯</div>
        <div className="stat-content">
          <span className="stat-label">Monthly Goal</span>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${progress.percentage}%`,
                backgroundColor: getStatusColor(progress.status)
              }}
            />
          </div>
          <div className="goal-text">
            <span>{formatEmission(stats.monthly)}</span>
            <span className="goal-divider">/</span>
            <span>{formatEmission(monthlyGoal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
