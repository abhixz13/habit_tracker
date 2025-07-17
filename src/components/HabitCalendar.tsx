import React, { useState } from 'react';

interface Habit {
  name: string;
  icon: string | { svg: React.ReactNode };
}

interface HabitCalendarProps {
  habits: Habit[];
  checkedDays: { [habit: string]: { [date: string]: boolean } };
  onToggleCheck: (habit: string, date: string) => void;
}

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfWeek = (year: number, month: number) => {
  return new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
};

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HabitCalendar: React.FC<HabitCalendarProps> = ({ habits, checkedDays, onToggleCheck }) => {
  const today = new Date();
  const [calendarDate, setCalendarDate] = useState<{ year: number; month: number }>({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const { year, month } = calendarDate;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);

  // Build calendar grid: array of weeks, each week is array of days (or null for empty)
  const calendar: (string | null)[][] = [];
  let week: (string | null)[] = Array(firstDayOfWeek).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    week.push(dateStr);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    calendar.push(week);
  }

  // Handlers for month navigation
  const handlePrevMonth = () => {
    setCalendarDate((prev) => {
      const newMonth = prev.month - 1;
      if (newMonth < 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: newMonth };
    });
  };
  const handleNextMonth = () => {
    setCalendarDate((prev) => {
      const newMonth = prev.month + 1;
      if (newMonth > 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: newMonth };
    });
  };

  // For habit selection modal
  const [modal, setModal] = useState<{ open: boolean; date: string | null }>({ open: false, date: null });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = Array.from({ length: 21 }, (_, i) => 2015 + i); // 2015-2035

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 16 }}>
        <button
          onClick={handlePrevMonth}
          style={{
            background: '#f3f6fa',
            border: 'none',
            borderRadius: 8,
            padding: '10px 28px',
            fontWeight: 500,
            fontSize: 18,
            color: '#222',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'background 0.2s',
          }}
        >
          Previous Month
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 220 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select
              value={month}
              onChange={e => setCalendarDate(d => ({ ...d, month: Number(e.target.value) }))}
              style={{ fontSize: 18, padding: '4px 8px', borderRadius: 6 }}
            >
              {months.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={e => setCalendarDate(d => ({ ...d, year: Number(e.target.value) }))}
              style={{ fontSize: 18, padding: '4px 8px', borderRadius: 6 }}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700, letterSpacing: 1, textAlign: 'center' }}>
            {months[month]} {year}
          </h2>
        </div>
        <button
          onClick={handleNextMonth}
          style={{
            background: '#f3f6fa',
            border: 'none',
            borderRadius: 8,
            padding: '10px 28px',
            fontWeight: 500,
            fontSize: 18,
            color: '#222',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'background 0.2s',
          }}
        >
          Next Month
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 8 }}>
        {weekDays.map((wd) => (
          <div key={wd} style={{ fontWeight: 600, textAlign: 'center', fontSize: 18, color: '#222' }}>{wd}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 16 }}>
        {calendar.flat().map((date, idx) => (
          <div
            key={idx}
            style={{
              minHeight: 120,
              border: '1px solid #e3e7ee',
              borderRadius: 12,
              padding: 12,
              background: date === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}` ? '#eaf6fd' : '#fff',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              fontSize: 16,
            }}
          >
            {date ? (
              <>
                <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 20 }}>{parseInt(date.split('-')[2], 10)}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
                  {habits.length === 0 ? (
                    <span style={{ color: '#aaa', fontSize: 14 }}>No habits</span>
                  ) : (
                    habits.map((habit) => (
                      <label key={habit.name} style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 5, width: '100%' }}>
                        <input
                          type="checkbox"
                          checked={!!checkedDays[habit.name]?.[date]}
                          onChange={() => onToggleCheck(habit.name, date)}
                          style={{ width: 15, height: 15 }}
                        />
                        <span>{typeof habit.icon === 'string' ? habit.icon : habit.icon.svg}</span>
                        {habit.name}
                      </label>
                    ))
                  )}
                </div>
              </>
            ) : null}
          </div>
        ))}
      </div>
      {/* Modal for selecting habits for a day */}
      {modal.open && modal.date && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setModal({ open: false, date: null })}
        >
          <div
            style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 240 }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Select Habits for {modal.date}</h3>
            {habits.length === 0 ? (
              <span style={{ color: '#aaa', fontSize: 12 }}>No habits</span>
            ) : (
              habits.map((habit) => (
                <label key={habit.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <input
                    type="checkbox"
                    checked={!!checkedDays[habit.name]?.[modal.date!]}
                    onChange={() => onToggleCheck(habit.name, modal.date!)}
                  />
                  <span>{typeof habit.icon === 'string' ? habit.icon : habit.icon.svg}</span>
                  {habit.name}
                </label>
              ))
            )}
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <button onClick={() => setModal({ open: false, date: null })}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitCalendar; 