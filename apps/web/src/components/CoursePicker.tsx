import React, { useState } from 'react';
import { useI18n } from '../i18nContext';
import './CoursePicker.css';

export interface Course {
  id: string;
  code: string;
  nameAr: string;
  creditHours: number;
}

export interface CoursePickerProps {
  availableCourses: Course[];
  selectedCourses: Course[];
  onChange: (courses: Course[]) => void;
}

export const CoursePicker: React.FC<CoursePickerProps> = ({ availableCourses = [], selectedCourses = [], onChange }) => {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Filter courses based on search term (code or Arabic name)
  const filteredCourses = availableCourses.filter(course => 
    !selectedCourses.find(sc => sc.id === course.id) &&
    (course.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
     course.nameAr.includes(searchTerm))
  );

  const handleSelect = (course: Course) => {
    onChange([...selectedCourses, course]);
    setSearchTerm('');
  };

  const handleRemove = (courseId: string) => {
    onChange(selectedCourses.filter(c => c.id !== courseId));
  };

  return (
    <div className="course-picker-container">
      <h3 style={{ marginBottom: '-8px' }}>{t('selectedCourses')}</h3>
      
      <div className="selected-chips">
        {selectedCourses.length === 0 && (
          <div style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            {t('noCoursesSelected')}
          </div>
        )}
        {selectedCourses.map(course => (
          <div key={course.id} className="chip">
            <span className="text-latin">{course.code}</span>
            <span>-</span>
            <span>{course.nameAr}</span>
            <button 
              className="chip-remove" 
              onClick={() => handleRemove(course.id)}
              aria-label="إزالة"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <div className="selection-count tabular-nums">
        {t('selectedCount').replace('{count}', selectedCourses.length.toString())}
      </div>

      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)} // delay to allow click on dropdown
        />
        
        {isFocused && filteredCourses.length > 0 && (
          <div className="search-dropdown">
            {filteredCourses.map(course => (
              <div 
                key={course.id} 
                className="search-item"
                onMouseDown={(e) => { e.preventDefault(); handleSelect(course); }}
              >
                <div>
                  <div className="text-latin" style={{ fontWeight: 600 }}>{course.code}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>{course.nameAr}</div>
                </div>
                <div className="tabular-nums" style={{ fontSize: '0.8rem', backgroundColor: 'var(--color-canvas)', padding: '4px 8px', borderRadius: '4px' }}>
                  {course.creditHours} {t('credits')}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {isFocused && searchTerm && filteredCourses.length === 0 && (
          <div className="search-dropdown" style={{ padding: '16px', textAlign: 'center', color: 'var(--color-muted)' }}>
            {t('noResults')}
          </div>
        )}
      </div>
    </div>
  );
};
