import React from 'react';
import { useI18n } from '../i18nContext';
import { TimeBlocker } from './TimeBlocker';
import type { TimeWindow } from './TimeBlocker';
import './PreferencesPanel.css';

export interface Preferences {
  minCredits: number;
  maxCredits: number;
  gapWeight: number;
  daysWeight: number;
  earlyTime: string;
  lateTime: string;
  blockedWindows: TimeWindow[];
}

interface Props {
  preferences: Preferences;
  onChange: (prefs: Preferences) => void;
}

export const PreferencesPanel: React.FC<Props> = ({ preferences, onChange }) => {
  const { t } = useI18n();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' || e.target.type === 'range' 
      ? parseInt(e.target.value, 10) 
      : e.target.value;
    onChange({ ...preferences, [e.target.name]: value });
  };

  return (
    <div className="preferences-panel">
      <h3 style={{ marginBottom: '-8px' }}>{t('scheduleSettings')}</h3>
      
      <div className="pref-group" style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <div className="pref-header">
            <label className="pref-label">{t('minCredits')}</label>
          </div>
          <input 
            type="number" 
            name="minCredits"
            className="time-input tabular-nums" 
            value={preferences.minCredits}
            onChange={handleChange}
            min="3" max="21"
          />
        </div>
        <div style={{ flex: 1 }}>
          <div className="pref-header">
            <label className="pref-label">{t('maxCredits')}</label>
          </div>
          <input 
            type="number" 
            name="maxCredits"
            className="time-input tabular-nums" 
            value={preferences.maxCredits}
            onChange={handleChange}
            min="3" max="21"
          />
        </div>
      </div>

      <div className="pref-group">
        <div className="pref-header">
          <label className="pref-label" htmlFor="gapWeight">{t('gaps')}</label>
          <span className="pref-value tabular-nums">{preferences.gapWeight}%</span>
        </div>
        <input 
          type="range" 
          name="gapWeight"
          id="gapWeight"
          className="pref-slider" 
          min="0" max="100" 
          value={preferences.gapWeight}
          onChange={handleChange} 
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
          <span>{t('minGaps')}</span>
          <span>{t('doesntMatter')}</span>
        </div>
      </div>

      <div className="pref-group">
        <div className="pref-header">
          <label className="pref-label" htmlFor="daysWeight">{t('daysSpread')}</label>
          <span className="pref-value tabular-nums">{preferences.daysWeight}%</span>
        </div>
        <input 
          type="range" 
          name="daysWeight"
          id="daysWeight"
          className="pref-slider" 
          min="0" max="100" 
          value={preferences.daysWeight}
          onChange={handleChange} 
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
          <span>{t('fewerDays')}</span>
          <span>{t('doesntMatter')}</span>
        </div>
      </div>

      <div className="pref-group">
        <div className="pref-header">
          <label className="pref-label">{t('preferredTimes')}</label>
        </div>
        <div className="time-range-group">
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '4px' }}>{t('earliestTime')}</div>
            <input type="time" name="earlyTime" className="time-input text-latin" value={preferences.earlyTime} onChange={handleChange} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '4px' }}>{t('latestTime')}</div>
            <input type="time" name="lateTime" className="time-input text-latin" value={preferences.lateTime} onChange={handleChange} />
          </div>
        </div>
      </div>
      
      <TimeBlocker 
        blockedWindows={preferences.blockedWindows || []}
        onChange={(windows) => onChange({ ...preferences, blockedWindows: windows })}
      />
      
    </div>
  );
};
