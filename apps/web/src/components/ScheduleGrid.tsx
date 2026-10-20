import React from 'react';
import { useI18n } from '../i18nContext';
import './ScheduleGrid.css';

export interface GridSection {
  id: string;
  courseCode: string;
  courseName?: string;
  sectionNo: string;
  instructor: string;
  colorIndex: number; // 1 to 8 to pick from CSS variables
  meetingTimes: {
    dayOfWeek: number; // 0=Sunday, 1=Monday, ...
    startsAt: string; // "HH:mm"
    endsAt: string; // "HH:mm"
    room?: string;
  }[];
}

interface ScheduleGridProps {
  sections: GridSection[];
  startHour?: number; // default 8 (8:00 AM)
  endHour?: number;   // default 18 (6:00 PM)
}


const HOUR_HEIGHT = 60;
const PIXELS_PER_MINUTE = HOUR_HEIGHT / 60; // 1 hour = 60px

const timeToMinutes = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const formatTimeLabel = (hour: number) => {
  const h = hour % 12 || 12;
  const ampm = hour < 12 ? 'ص' : 'م';
  return `${h}:00 ${ampm}`;
};

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  sections,
  startHour = 8,
  endHour = 18,
}) => {
  const { t } = useI18n();
  const DAYS = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu')];
  const startMinutes = startHour * 60;
  const totalHours = endHour - startHour;
  
  // Render time labels on the left (or right in RTL, but we keep it structured)
  const timeLabels = [];
  for (let h = startHour; h <= endHour; h++) {
    timeLabels.push(
      <div 
        key={`time-${h}`} 
        className="schedule-time-label tabular-nums"
        style={{ top: `${(h - startHour) * HOUR_HEIGHT}px` }}
      >
        {formatTimeLabel(h)}
      </div>
    );
  }

  // Group sections by day to render them in the correct column
  const sectionsByDay: { [day: number]: React.ReactNode[] } = {
    0: [], 1: [], 2: [], 3: [], 4: []
  };

  sections.forEach(section => {
    section.meetingTimes.forEach((mt, mtIdx) => {
      const startMins = timeToMinutes(mt.startsAt);
      const endMins = timeToMinutes(mt.endsAt);
      
      const top = (startMins - startMinutes) * PIXELS_PER_MINUTE;
      const height = (endMins - startMins) * PIXELS_PER_MINUTE;
      
      // Safety bounds
      if (top < 0 || mt.dayOfWeek > 4) return;

      const backgroundColor = `var(--block-${section.colorIndex})`;

      sectionsByDay[mt.dayOfWeek].push(
        <div 
          key={`${section.id}-${mtIdx}`}
          className="course-block"
          style={{ top: `${top}px`, height: `${height}px`, backgroundColor, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          title={`${section.courseName || section.courseCode} - ${mt.startsAt} to ${mt.endsAt}`}
        >
          <div className="course-code" style={{ fontSize: '0.75rem', whiteSpace: 'normal', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.1', marginBottom: '2px' }}>
            {section.courseName || section.courseCode}
          </div>
          <div className="course-details text-latin" style={{ fontSize: '0.65rem', marginTop: '0', fontWeight: 500, lineHeight: '1.1' }}>
            {mt.startsAt} - {mt.endsAt}
          </div>
          {mt.room && (
            <div className="course-details text-latin" style={{ fontSize: '0.65rem', marginTop: '1px', opacity: 0.9, lineHeight: '1.1' }}>
              {mt.room.replace(/قاعة محوسبة\s*/ig, 'DS-ICT ').replace(/(DS-ICT\s*)+/ig, 'DS-ICT ')}
            </div>
          )}
        </div>
      );
    });
  });

  return (
    <div className="schedule-grid-container">
      <div className="schedule-header">
        <div className="schedule-day-label"></div> {/* Empty corner over times */}
        {DAYS.map(day => (
          <div key={day} className="schedule-day-label">
            {day}
          </div>
        ))}
      </div>
      
      <div className="schedule-body" style={{ height: `${totalHours * HOUR_HEIGHT}px` }}>
        <div className="schedule-times">
          {timeLabels}
        </div>
        
        {[0, 1, 2, 3, 4].map(day => (
          <div key={`col-${day}`} className="schedule-day-column">
            {sectionsByDay[day]}
          </div>
        ))}
      </div>
    </div>
  );
};
