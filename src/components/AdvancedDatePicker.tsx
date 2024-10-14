import React, { useState } from 'react';
import DatePicker from './DatePicker'; 
import '../styles/AdvancedDatePicker.css'; 

const AdvancedDatePicker: React.FC = () => {
  const [excludeWeekends, setExcludeWeekends] = useState(false); 
  const [showSettings, setShowSettings] = useState(false);
  const [maxDateRange, setMaxDateRange] = useState(30); 

  const toggleSettings = () => setShowSettings(!showSettings);

  // Handle input for custom date range limit
  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setMaxDateRange(isNaN(value) || value <= 0 ? 30 : value); 
  };

  return (
    <div className="advanced-date-picker">
      <h2>Advanced Date Picker</h2>
      <span className="settings-icon" onClick={toggleSettings}>
        ⚙️ Customize
      </span>

      
      <DatePicker excludeWeekends={excludeWeekends} maxDateRange={maxDateRange} />

      
      <div className={`settings-modal ${showSettings ? 'show' : ''}`}>
        <div className="modal-content">
          <h3>Customize Date Selection Rules</h3>
          
          
          <div className="setting-item">
            <label>
              Max Date Range (in days):
              <input
                type="number"
                value={maxDateRange}
                onChange={handleRangeChange}
                min="1"
                max="30"
              />
            </label>
          </div>

          <div className="setting-item">
            <label>
              Exclude Weekends
              <input
                type="checkbox"
                checked={excludeWeekends}
                onChange={() => setExcludeWeekends(!excludeWeekends)}
              />
            </label>
          </div>

          <button onClick={toggleSettings} className="close-button">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDatePicker;
