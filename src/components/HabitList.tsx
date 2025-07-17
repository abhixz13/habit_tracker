import React, { useState } from 'react';

const emojiOptions = ['💧', '🏃‍♂️', '📚', '🧘‍♂️', '🍎', '🛏️', '🦷', '☀️', '📝', '💪'];
const svgOptions = [
  { name: 'Star', svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="gold"><polygon points="10,2 12,7.5 18,7.5 13,11.5 15,17 10,13.5 5,17 7,11.5 2,7.5 8,7.5" /></svg> },
  { name: 'Heart', svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="red"><path d="M10 17s-6-4.35-6-8.5A3.5 3.5 0 0 1 10 5a3.5 3.5 0 0 1 6 3.5C16 12.65 10 17 10 17z" /></svg> },
  { name: 'Check', svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="green"><polyline points="4,11 8,15 16,6" stroke="green" strokeWidth="2" fill="none" /></svg> },
];

interface Habit {
  name: string;
  icon: string | { svg: React.ReactNode };
}

interface HabitListProps {
  habits: Habit[];
  onAddHabit: (habit: Habit) => void;
  onRemoveHabit: (habitName: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onAddHabit, onRemoveHabit }) => {
  const [newHabit, setNewHabit] = useState('');
  const [iconType, setIconType] = useState<'emoji' | 'svg'>('emoji');
  const [selectedIcon, setSelectedIcon] = useState<string | { svg: React.ReactNode }>(emojiOptions[0]);

  const handleAdd = () => {
    if (newHabit.trim()) {
      const icon = iconType === 'emoji' ? selectedIcon : selectedIcon;
      onAddHabit({ name: newHabit.trim(), icon });
      setNewHabit('');
      setSelectedIcon(emojiOptions[0]);
      setIconType('emoji');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 350 }}>
      <label htmlFor="habit-input" style={{ fontWeight: 500, marginBottom: 6, display: 'block', fontSize: 18 }}>
        Habit Name <span style={{ color: 'red' }}>*</span>
      </label>
      <input
        id="habit-input"
        type="text"
        value={newHabit}
        onChange={(e) => setNewHabit(e.target.value)}
        placeholder="Enter habit name"
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 6,
          border: '1px solid #d1d5db',
          fontSize: 16,
          marginBottom: 16,
          boxSizing: 'border-box',
        }}
      />
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 500, marginRight: 8 }}>Icon:</span>
        <label style={{ marginRight: 8 }}>
          <input type="radio" checked={iconType === 'emoji'} onChange={() => { setIconType('emoji'); setSelectedIcon(emojiOptions[0]); }} /> Emoji
        </label>
        <label>
          <input type="radio" checked={iconType === 'svg'} onChange={() => { setIconType('svg'); setSelectedIcon(svgOptions[0]); }} /> SVG
        </label>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {iconType === 'emoji'
          ? emojiOptions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                style={{
                  fontSize: 22,
                  padding: 4,
                  border: selectedIcon === emoji ? '2px solid #3498f3' : '1px solid #d1d5db',
                  borderRadius: 6,
                  background: '#fff',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedIcon(emoji)}
              >
                {emoji}
              </button>
            ))
          : svgOptions.map((svg) => (
              <button
                key={svg.name}
                type="button"
                style={{
                  padding: 4,
                  border: selectedIcon === svg ? '2px solid #3498f3' : '1px solid #d1d5db',
                  borderRadius: 6,
                  background: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => setSelectedIcon(svg)}
              >
                {svg.svg}
              </button>
            ))}
      </div>
      <button
        onClick={handleAdd}
        style={{
          width: '100%',
          background: '#3498f3',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '12px 0',
          fontSize: 18,
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: 24,
        }}
      >
        Add Habit
      </button>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {habits.map((habit) => (
          <li key={habit.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>
              {typeof habit.icon === 'string' ? habit.icon : habit.icon.svg} {habit.name}
            </span>
            <button
              onClick={() => onRemoveHabit(habit.name)}
              style={{
                background: 'none',
                border: 'none',
                color: '#e74c3c',
                cursor: 'pointer',
                fontSize: 22,
                lineHeight: 1,
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
              title="Remove habit"
              aria-label={`Remove ${habit.name}`}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HabitList; 