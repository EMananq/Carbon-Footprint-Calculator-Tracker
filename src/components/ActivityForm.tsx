// Activity Form Component
import { useState } from 'react';
import type { ActivityCategory } from '../types';
import { ACTIVITY_OPTIONS, ACTIVITY_LABELS } from '../types';
import { calculateEmission, formatEmission } from '../utils/emissionCalculator';
import './ActivityForm.css';

interface ActivityFormProps {
  onSubmit: (data: {
    category: ActivityCategory;
    type: string;
    value: number;
    unit: string;
    date: string;
    notes: string;
  }) => Promise<void>;
  initialData?: {
    category: ActivityCategory;
    type: string;
    value: number;
    date: string;
    notes: string;
  };
  onCancel?: () => void;
}

export default function ActivityForm({ onSubmit, initialData, onCancel }: ActivityFormProps) {
  const [category, setCategory] = useState<ActivityCategory>(initialData?.category || 'transport');
  const [type, setType] = useState(initialData?.type || 'car_petrol');
  const [value, setValue] = useState(initialData?.value?.toString() || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentOptions = ACTIVITY_OPTIONS[category];
  const currentUnit = currentOptions.find(opt => opt.value === type)?.unit || 'units';
  const previewEmission = value ? calculateEmission(type, parseFloat(value)) : 0;

  const handleCategoryChange = (newCategory: ActivityCategory) => {
    setCategory(newCategory);
    const firstOption = ACTIVITY_OPTIONS[newCategory][0];
    if (firstOption) {
      setType(firstOption.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value || parseFloat(value) <= 0) {
      setError('Please enter a valid value');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        category,
        type,
        value: parseFloat(value),
        unit: currentUnit,
        date,
        notes,
      });
      
      // Reset form
      setValue('');
      setNotes('');
    } catch (err) {
      setError('Failed to save activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickAddOptions = [
    { category: 'transport' as ActivityCategory, type: 'car_petrol', value: 10, label: '🚗 10km Drive' },
    { category: 'transport' as ActivityCategory, type: 'bus', value: 15, label: '🚌 15km Bus' },
    { category: 'energy' as ActivityCategory, type: 'electricity', value: 5, label: '💡 5 kWh' },
    { category: 'diet' as ActivityCategory, type: 'vegetarian', value: 1, label: '🥗 Veg Meal' },
    { category: 'diet' as ActivityCategory, type: 'beef', value: 1, label: '🥩 Beef Meal' },
  ];

  const handleQuickAdd = async (option: typeof quickAddOptions[0]) => {
    setLoading(true);
    try {
      await onSubmit({
        category: option.category,
        type: option.type,
        value: option.value,
        unit: ACTIVITY_OPTIONS[option.category].find(o => o.value === option.type)?.unit || 'units',
        date: new Date().toISOString().split('T')[0],
        notes: 'Quick add',
      });
    } catch (err) {
      setError('Failed to add activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-form-container">
      {/* Quick Add Buttons */}
      <div className="quick-add-section">
        <h4>Quick Add</h4>
        <div className="quick-add-buttons">
          {quickAddOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              className="quick-add-btn"
              onClick={() => handleQuickAdd(option)}
              disabled={loading}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-divider">
        <span>or add custom activity</span>
      </div>

      <form onSubmit={handleSubmit} className="activity-form">
        {error && <div className="form-error">{error}</div>}

        {/* Category Selection */}
        <div className="category-tabs">
          {(['transport', 'energy', 'diet'] as ActivityCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-tab ${category === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat === 'transport' && '🚗'}
              {cat === 'energy' && '⚡'}
              {cat === 'diet' && '🍽️'}
              <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
            </button>
          ))}
        </div>

        {/* Activity Type */}
        <div className="form-group">
          <label className="form-label">Activity Type</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {currentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Value Input */}
        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Amount ({currentUnit})</label>
            <input
              type="number"
              className="form-input"
              placeholder={`Enter ${currentUnit}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              min="0"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Emission Preview */}
        {value && parseFloat(value) > 0 && (
          <div className="emission-preview">
            <span className="preview-label">Estimated CO₂ Emission:</span>
            <span className="preview-value">{formatEmission(previewEmission)}</span>
          </div>
        )}

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Notes (optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="Add a note..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Submit Buttons */}
        <div className="form-actions">
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (initialData ? 'Update Activity' : 'Add Activity')}
          </button>
        </div>
      </form>
    </div>
  );
}
