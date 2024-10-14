import React, { useState ,useEffect } from 'react';
import '../styles/DatePicker.css'; 

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

interface DatePickerProps {
  excludeWeekends?: boolean;
  maxDateRange?: number; 
}

const DatePicker: React.FC<DatePickerProps> = ({ excludeWeekends = false, maxDateRange = 30 }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [showStartCalendar, setShowStartCalendar] = useState(false); 
  const [showEndCalendar, setShowEndCalendar] = useState(false); 
  const [showYearSelector, setShowYearSelector] = useState(false); 
  const [yearList] = useState(Array.from({ length: 40 }, (_, i) => currentYear - 20 + i));
  
  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

  const isPastDate = (date: Date) => selectedStartDate ? date < selectedStartDate : false;

  const handleDateClick = (day: number, isStart: boolean) => {
    const selectedDate = new Date(currentYear, selectedMonth, day);
    
    if (isStart) {
      setSelectedStartDate(selectedDate);
      setSelectedEndDate(null); 
      setShowStartCalendar(false); 
    } else {
      if (selectedStartDate && selectedDate >= selectedStartDate && 
          (!excludeWeekends || !isWeekend(selectedDate)) && 
          !isPastDate(selectedDate)) {
        
        const dateDiff = Math.ceil((selectedDate.getTime() - selectedStartDate.getTime()) / (1000 * 3600 * 24));
        
        if (dateDiff <= maxDateRange) {
          setSelectedEndDate(selectedDate);
          setShowEndCalendar(false); 
        } else {
          alert(`Please select a date within ${maxDateRange} days from the start date.`);
        }
      }
    }
  };

  const changeMonth = (direction: number) => {
    const newMonth = selectedMonth + direction;
    if (newMonth < 0) {
      setSelectedMonth(11);
      setCurrentYear(currentYear - 1);
    } else if (newMonth > 11) {
      setSelectedMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setSelectedMonth(newMonth);
    }
  };

  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const toggleYearSelector = () => setShowYearSelector(!showYearSelector);

  const selectYear = (year: number) => {
    setCurrentYear(year);
    setShowYearSelector(false);
  };

  
  const [commonCalendarMonth, setCommonCalendarMonth] = useState<number>(new Date().getMonth());
  const [commonCalendarYear, setCommonCalendarYear] = useState<number>(new Date().getFullYear());

 
  useEffect(() => {
    if (selectedStartDate) {
      setCommonCalendarMonth(selectedStartDate.getMonth());
      setCommonCalendarYear(selectedStartDate.getFullYear());
    }
  }, [selectedStartDate]);

  
  const changeCommonCalendarMonth = (direction: number) => {
    const newMonth = commonCalendarMonth + direction;
    if (newMonth < 0) {
      setCommonCalendarMonth(11);
      setCommonCalendarYear(commonCalendarYear - 1);
    } else if (newMonth > 11) {
      setCommonCalendarMonth(0);
      setCommonCalendarYear(commonCalendarYear + 1);
    } else {
      setCommonCalendarMonth(newMonth);
    }
  };

  const isInRange = (date: Date) => {
    return selectedStartDate && selectedEndDate && date >= selectedStartDate && date <= selectedEndDate;
  };

  const handleMonthKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      changeMonth(-1);
    } else if (event.key === 'ArrowRight') {
      changeMonth(1);
    }
  };

  return (
    <div className="date-range-picker" role="dialog" aria-labelledby="date-range-picker" aria-modal="true">
      <h2 id="date-range-picker">Select Date Range</h2>
      <div className="dual-pane">
       
        <div className="dropdown">
          <label htmlFor="start-date">Start Date</label>
          <button id="start-date" onClick={() => {
            setShowStartCalendar(!showStartCalendar);
            setShowEndCalendar(false); 
          }}>
            {selectedStartDate ? selectedStartDate.toDateString() : 'Select Start Date'}
          </button>
          {showStartCalendar && (
            <div className="calendar-dropdown" aria-label="Start Date Calendar">
              <div
                className="year-month-selector"
                onKeyDown={handleMonthKeyPress}
                tabIndex={0} 
                role="group"
              >
                <button className="nav-button" onClick={() => changeMonth(-1)} aria-label="Previous Month">&lt;</button>
                <div className="year-month-display" onClick={toggleYearSelector} aria-label="Select Year">
                  {months[selectedMonth]} {currentYear}
                </div>
                <button className="nav-button" onClick={() => changeMonth(1)} aria-label="Next Month">&gt;</button>
              </div>
              {showYearSelector && (
        <div className="year-list-container">
          {yearList.map(year => (
            <div key={year} className="year-item" onClick={() => selectYear(year)}>
              {year}
            </div>
          ))}
                </div>
              )}
              <div className="calendar-header">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="calendar-day-header">{day}</div>
                ))}
              </div>
              <div className="calendar">
                {Array.from({ length: getFirstDayOfMonth(selectedMonth, currentYear) }).map((_, index) => (
                  <div key={`empty-${index}`} className="calendar-day empty"></div>
                ))}
                {Array.from({ length: daysInMonth(selectedMonth, currentYear) }).map((_, index) => {
                  const day = index + 1;
                  const date = new Date(currentYear, selectedMonth, day);
                  const isDisabled = (excludeWeekends && isWeekend(date));
                  return (
                    <div
                      key={day}
                      className={`calendar-day ${isDisabled ? 'disabled' : ''} 
                        ${selectedStartDate && selectedStartDate.getDate() === day && selectedStartDate.getMonth() === selectedMonth ? 'in-range' : ''}`} 
                      onClick={() => !isDisabled && handleDateClick(day, true)}
                      tabIndex={0} 
                      role="button"
                      onKeyDown={(e) => e.key === 'Enter' && !isDisabled && handleDateClick(day, true)}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        
        <div className="dropdown">
          <label htmlFor="end-date">End Date</label>
          <button id="end-date" onClick={() => {
            setShowEndCalendar(!showEndCalendar);
            setShowStartCalendar(false);
          }} disabled={!selectedStartDate}>
            {selectedEndDate ? selectedEndDate.toDateString() : 'Select End Date'}
          </button>
          {showEndCalendar && (
            <div className="calendar-dropdown" aria-label="End Date Calendar">
              <div
                className="year-month-selector"
                onKeyDown={handleMonthKeyPress}
                tabIndex={0} 
                role="group"
              >
                <button className="nav-button" onClick={() => changeMonth(-1)} aria-label="Previous Month">&lt;</button>
                <div className="year-month-display" onClick={toggleYearSelector} aria-label="Select Year">
                  {months[selectedMonth]} {currentYear}
                </div>
                <button className="nav-button" onClick={() => changeMonth(1)} aria-label="Next Month">&gt;</button>
              </div>
              {showYearSelector && (
                <div className="year-selector">
                  {yearList.map(year => (
                    <div key={year} className="year-option" onClick={() => selectYear(year)}>
                      {year}
                    </div>
                  ))}
                </div>
              )}
              <div className="calendar-header">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="calendar-day-header">{day}</div>
                ))}
              </div>
              <div className="calendar">
                {Array.from({ length: getFirstDayOfMonth(selectedMonth, currentYear) }).map((_, index) => (
                  <div key={`empty-${index}`} className="calendar-day empty"></div>
                ))}
                {Array.from({ length: daysInMonth(selectedMonth, currentYear) }).map((_, index) => {
                  const day = index + 1;
                  const date = new Date(currentYear, selectedMonth, day);
                  const isDisabled = (excludeWeekends && isWeekend(date)) || isPastDate(date) || (selectedStartDate && date < selectedStartDate);
                  return (
                    <div
                      key={day}
                      className={`calendar-day ${isDisabled ? 'disabled' : ''} 
                        ${selectedEndDate && selectedEndDate.getDate() === day && selectedEndDate.getMonth() === selectedMonth ? 'in-range' : ''}`} 
                      onClick={() => !isDisabled && handleDateClick(day, false)}
                      tabIndex={0} 
                      role="button"
                      onKeyDown={(e) => e.key === 'Enter' && !isDisabled && handleDateClick(day, false)}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      
      <div className="date-range-picker">
     
      {selectedStartDate && selectedEndDate && (
        <div className="common-calendar">
          <h3>Selected Range:</h3>
          <div className="year-month-selector">
            <button className="nav-button" onClick={() => changeCommonCalendarMonth(-1)} aria-label="Previous Month">&lt;</button>
            <div className="year-month-display">
              {months[commonCalendarMonth]} {commonCalendarYear}
            </div>
            <button className="nav-button" onClick={() => changeCommonCalendarMonth(1)} aria-label="Next Month">&gt;</button>
          </div>
          <div className="calendar-header">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
          </div>
          <div className="calendar">
            {Array.from({ length: getFirstDayOfMonth(commonCalendarMonth, commonCalendarYear) }).map((_, index) => (
              <div key={`empty-${index}`} className="calendar-day empty"></div>
            ))}
            {Array.from({ length: daysInMonth(commonCalendarMonth, commonCalendarYear) }).map((_, index) => {
              const day = index + 1;
              const date = new Date(commonCalendarYear, commonCalendarMonth, day);
              return (
                <div
                  key={day}
                  className={`calendar-day ${isInRange(date) ? 'selected-range' : ''}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
      
    </div>
  );
};

export default DatePicker;

