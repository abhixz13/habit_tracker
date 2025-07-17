import React, { useState, useEffect } from 'react';
import HabitList from './components/HabitList';
import HabitCalendar from './components/HabitCalendar';
import './App.css'

const HABITS_KEY = 'habit-tracker-habits';
const CHECKED_KEY = 'habit-tracker-checkedDays';

interface Habit {
  name: string;
  icon: string | { svg: React.ReactNode };
}

function App() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const habitsLS = localStorage.getItem(HABITS_KEY);
    return habitsLS ? JSON.parse(habitsLS) : [];
  });
  const [checkedDays, setCheckedDays] = useState<{ [habit: string]: { [date: string]: boolean } }>(() => {
    const checkedLS = localStorage.getItem(CHECKED_KEY);
    return checkedLS ? JSON.parse(checkedLS) : {};
  });

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  }, [habits]);
  useEffect(() => {
    localStorage.setItem(CHECKED_KEY, JSON.stringify(checkedDays));
  }, [checkedDays]);

  const handleAddHabit = (habit: Habit) => {
    setHabits((prev) => [...prev, habit]);
  };

  const handleRemoveHabit = (habitName: string) => {
    setHabits((prev) => prev.filter((h) => h.name !== habitName));
    setCheckedDays((prev) => {
      const newChecked = { ...prev };
      delete newChecked[habitName];
      return newChecked;
    });
  };

  const handleToggleCheck = (habitName: string, date: string) => {
    setCheckedDays((prev) => ({
      ...prev,
      [habitName]: {
        ...prev[habitName],
        [date]: !prev[habitName]?.[date],
      },
    }));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: '32px 0' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 40, fontSize: 48, fontWeight: 700, letterSpacing: 1 }}>Habit Tracker</h1>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 56 }}>
          <div style={{ minWidth: 320, marginTop: 24 }}>
            <HabitList habits={habits} onAddHabit={handleAddHabit} onRemoveHabit={handleRemoveHabit} />
          </div>
          <div style={{ flex: 1, maxWidth: 950 }}>
            <HabitCalendar habits={habits} checkedDays={checkedDays} onToggleCheck={handleToggleCheck} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
