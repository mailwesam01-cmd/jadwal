import React, { useState } from 'react';
import { useI18n } from '../i18nContext';

export interface TimeWindow {
  dayOfWeek: number;
  startsAt: string;
  endsAt: string;
}

interface TimeBlockerProps {
  blockedWindows: TimeWindow[];
  onChange: (windows: TimeWindow[]) => void;
}

export const TimeBlocker: React.FC<TimeBlockerProps> = ({ blockedWindows, onChange }) => {
  const { t, locale } = useI18n();
  const [day, setDay] = useState<number>(0);
  const [start, setStart] = useState<string>('08:00');
  const [end, setEnd] = useState<string>('09:30');

  const daysOptions = [
    { value: 0, label: t('sun') },
    { value: 1, label: t('mon') },
    { value: 2, label: t('tue') },
    { value: 3, label: t('wed') },
    { value: 4, label: t('thu') },
  ];

  const handleAdd = () => {
    if (start >= end) {
      alert(locale === 'ar' ? 'وقت البداية يجب أن يكون قبل وقت النهاية' : 'Start time must be before end time');
      return;
    }
    const newWindow: TimeWindow = { dayOfWeek: day, startsAt: start, endsAt: end };
    onChange([...blockedWindows, newWindow]);
  };

  const handleRemove = (index: number) => {
    const updated = [...blockedWindows];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div style={{ marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
      <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--color-primary)' }}>{t('blockedTimes')}</h4>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 80px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '4px' }}>{t('day')}</label>
          <select 
            value={day} 
            onChange={e => setDay(Number(e.target.value))}
            className="search-input"
            style={{ padding: '6px', appearance: 'auto' }}
          >
            {daysOptions.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: '1 1 80px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '4px' }}>{t('fromTime')}</label>
          <input 
            type="time" 
            value={start}
            onChange={e => setStart(e.target.value)}
            className="search-input"
            style={{ padding: '4px' }}
          />
        </div>
        <div style={{ flex: '1 1 80px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '4px' }}>{t('toTime')}</label>
          <input 
            type="time" 
            value={end}
            onChange={e => setEnd(e.target.value)}
            className="search-input"
            style={{ padding: '4px' }}
          />
        </div>
        <button 
          onClick={handleAdd}
          className="btn btn-secondary"
          style={{ padding: '6px 12px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none' }}
        >
          + {t('addBlock')}
        </button>
      </div>

      {blockedWindows.length === 0 ? (
        <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', textAlign: 'center', padding: '8px' }}>
          {t('noBlockedTimes')}
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {blockedWindows.map((bw, i) => (
            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'var(--color-canvas)', borderRadius: '6px', fontSize: '0.85rem' }}>
              <span>
                <strong>{daysOptions.find(d => d.value === bw.dayOfWeek)?.label}</strong>: {bw.startsAt} - {bw.endsAt}
              </span>
              <button 
                onClick={() => handleRemove(i)}
                style={{ background: 'none', border: 'none', color: 'var(--color-conflict)', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
