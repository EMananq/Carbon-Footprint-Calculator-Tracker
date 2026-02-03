// Category Breakdown Component - Pie/Doughnut chart
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ActivityCategory } from '../types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types';
import { formatEmission } from '../utils/emissionCalculator';
import './CategoryBreakdown.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryBreakdownProps {
  data: Record<ActivityCategory, number>;
  title?: string;
}

export default function CategoryBreakdown({ data, title = 'Emissions by Category' }: CategoryBreakdownProps) {
  const categories = Object.keys(data) as ActivityCategory[];
  const values = categories.map(cat => data[cat]);
  const total = values.reduce((sum, val) => sum + val, 0);
  const hasData = total > 0;

  const chartData = {
    labels: categories.map(cat => CATEGORY_LABELS[cat]),
    datasets: [
      {
        data: values,
        backgroundColor: categories.map(cat => CATEGORY_COLORS[cat]),
        borderColor: 'rgba(17, 24, 39, 0.8)',
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f9fafb',
        bodyColor: '#9ca3af',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${formatEmission(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="category-breakdown-container">
      <h3 className="chart-title">{title}</h3>
      
      {hasData ? (
        <>
          <div className="doughnut-wrapper">
            <Doughnut data={chartData} options={options} />
            <div className="doughnut-center">
              <span className="center-value">{formatEmission(total)}</span>
              <span className="center-label">Total</span>
            </div>
          </div>

          <div className="category-legend">
            {categories.map(cat => {
              const value = data[cat];
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
              
              return (
                <div key={cat} className="legend-item">
                  <span 
                    className="legend-color" 
                    style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                  />
                  <span className="legend-label">{CATEGORY_LABELS[cat]}</span>
                  <span className="legend-value">{formatEmission(value)}</span>
                  <span className="legend-percent">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="no-data">
          <span className="no-data-icon">📊</span>
          <p>No emission data yet</p>
        </div>
      )}
    </div>
  );
}
