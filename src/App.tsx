import React, { useState } from 'react';
import AdvancedDatePicker from './components/AdvancedDatePicker'; 
import DatePicker from './components/DatePicker';
import './App.css'; 

const App: React.FC = () => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false); 

  return (
    <div className="App">
      <h1>Date Picker App</h1>

      
      <div className="mode-toggle">
        <label className="toggle-text">
          {isAdvancedMode ? 'Disable Advanced Mode' : 'Enable Advanced Mode'}
        </label>
        <label className="switch">
          <input
            type="checkbox"
            checked={isAdvancedMode}
            onChange={() => setIsAdvancedMode(!isAdvancedMode)} 
          />
          <span className="slider round"></span>
        </label>
      </div>

      
      {isAdvancedMode ? (
        <AdvancedDatePicker />
      ) : (
        <DatePicker />
      )}
    </div>
  );
};

export default App;
