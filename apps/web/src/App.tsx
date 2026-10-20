import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { exportToICS } from './utils/icsExport';
import { ScheduleGrid } from './components/ScheduleGrid';
import type { GridSection } from './components/ScheduleGrid';
import { CoursePicker } from './components/CoursePicker';
import type { Course } from './components/CoursePicker';
import { ExcelUploader } from './components/ExcelUploader';
import { PreferencesPanel } from './components/PreferencesPanel';
import { useI18n } from './i18nContext';
import './index.css';

function App() {
  const { t, locale, setLocale } = useI18n();
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('jadwal_selected_courses');
    return saved ? JSON.parse(saved) : [];
  });
  const [schedules, setSchedules] = useState<GridSection[][]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [preferences, setPreferences] = useState({
    minCredits: 12,
    maxCredits: 18,
    gapWeight: 50,
    daysWeight: 50,
    earlyTime: '08:00',
    lateTime: '16:00',
    blockedWindows: [] as {dayOfWeek: number, startsAt: string, endsAt: string}[]
  });
  const [selectedUniversity, setSelectedUniversity] = useState('ttu');
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const scheduleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear admin session if the user navigates back to the public app
    sessionStorage.removeItem('adminToken');
  }, []);

  // Fetch courses on mount
  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        // Assuming API returns { id, code, nameAr, creditHours }
        setAvailableCourses(data.map((c: any) => ({
          id: c.id,
          code: c.code,
          nameAr: locale === 'en' ? (c.nameEn || c.nameAr) : (c.nameAr || c.nameEn), // Adjust based on locale if possible
          creditHours: c.creditHours || 3
        })));
      }
    } catch (e) {
      console.error('Failed to fetch courses', e);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [locale]); // Refetch if locale changes to get different names if supported

  useEffect(() => {
    localStorage.setItem('jadwal_selected_courses', JSON.stringify(selectedCourses));
  }, [selectedCourses]);

  const handleGenerate = async () => {
    if (selectedCourses.length === 0) return;
    setIsLoading(true);
    try {
      const courseIds = selectedCourses.map(c => c.id);
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          termId: 'fall2026',
          courseIds, 
          hard: { 
            blockedWindows: preferences.blockedWindows, 
            includeFullSections: true,
            minCredits: preferences.minCredits,
            maxCredits: preferences.maxCredits
          },
          soft: { 
            preferredInstructors: [], 
            weights: { 
              gap: preferences.gapWeight, 
              days: preferences.daysWeight, 
              early: 1, 
              late: 1, 
              instructor: 1 
            } 
          },
          limit: 20
        })
      });
      if (res.ok) {
        const data = await res.json();
        
        const formattedSchedules = data.schedules.map((s: any) => 
          s.sections.map((sec: any, index: number) => ({
            id: sec.id,
            courseCode: sec.courseCode,
            courseName: selectedCourses.find(c => c.code === sec.courseCode)?.nameAr || sec.courseCode,
            sectionNo: sec.sectionNo,
            instructor: sec.instructor,
            colorIndex: (index % 8) + 1,
            meetingTimes: sec.meetingTimes
          }))
        );

        setSchedules(formattedSchedules);
        setConflicts(data.conflicts || []);
        setCurrentScheduleIndex(0);
        
        if (formattedSchedules.length === 0) {
          alert(t('noSchedulesFound'));
        }
      }
    } catch (e) {
      console.error('Failed to solve', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPNG = async () => {
    if (!scheduleRef.current) return;
    try {
      const canvas = await html2canvas(scheduleRef.current, { backgroundColor: '#F5F5FA', scale: 2 });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `jadwal-schedule-${currentScheduleIndex + 1}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  };

  const handleShare = async () => {
    if (selectedCourses.length === 0 || schedules.length === 0) return;
    setIsSharing(true);
    try {
      const currentSections = schedules[currentScheduleIndex];
      const sectionIds = currentSections.map(sec => sec.id);
      
      const res = await fetch('/api/schedules/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termId: 'fall2026', sectionIds })
      });
      
      if (res.ok) {
        const data = await res.json();
        const shareUrl = `${window.location.origin}/s/${data.slug}`;
        await navigator.clipboard.writeText(shareUrl);
        alert(t('linkCopied'));
      } else {
        throw new Error('Failed to create share link');
      }
    } catch (err) {
      console.error('Failed to share schedule', err);
      alert('Failed to generate share link.');
    } finally {
      setIsSharing(false);
    }
  };

  const currentSchedule = schedules[currentScheduleIndex] || [];

  return (
    <>
      {/* Top Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 32px',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ flex: 1 }}></div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <path d="M8 14h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M16 14h.01"></path>
            <path d="M8 18h.01"></path>
            <path d="M12 18h.01"></path>
            <path d="M16 18h.01"></path>
          </svg>
          <span style={{ fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.5px' }}>Jadwal</span>
          <span style={{ fontSize: '1.5rem', opacity: 0.3, padding: '0 4px', fontWeight: 300 }}>|</span>
          <span style={{ fontWeight: 800, fontSize: '1.75rem', paddingBottom: '2px' }}>جدول</span>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
          >
            <span style={{ fontSize: '1.2rem' }}>🌐</span>
            {locale === 'ar' ? 'English' : 'عربي'}
          </button>
        </div>
      </nav>

      <div className="container" style={{ padding: '40px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ color: 'var(--color-primary)', marginBottom: '12px', fontSize: '2.5rem' }}>{t('appTitle')}</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem' }}>{t('appSubtitle')}</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
          <div className="surface-card" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>{t('searchCourses')}</h2>
            <CoursePicker 
              availableCourses={availableCourses}
              selectedCourses={selectedCourses}
              onChange={setSelectedCourses}
            />
            <PreferencesPanel 
              preferences={preferences}
              onChange={setPreferences}
            />
            
            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', opacity: selectedCourses.length === 0 ? 0.5 : 1, padding: '12px', fontSize: '1.1rem' }}
                onClick={handleGenerate}
                disabled={selectedCourses.length === 0 || isLoading}
              >
                {isLoading ? t('generatingButton') : t('generateButton')}
              </button>
            </div>

            <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{t('importExcel')}</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '8px' }}>
                  {locale === 'ar' ? 'الجامعة المدعومة حالياً:' : 'Currently Supported University:'}
                </label>
                <select 
                  className="search-input" 
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  style={{ appearance: 'auto', padding: '10px 12px', cursor: 'pointer' }}
                >
                  <option value="ttu">جامعة الطفيلة التقنية (TTU)</option>
                  <option value="other" disabled>جامعات أخرى (قريباً...) - Other Universities (Coming Soon)</option>
                </select>
              </div>

              <ExcelUploader onSuccess={fetchCourses} />
              
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button 
                  onClick={() => alert(locale === 'ar' ? 'سيتم توفير القالب قريباً' : 'Template will be provided soon')}
                  style={{ fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {t('downloadTemplate')}
                </button>
              </div>
            </div>
          </div>

          <div className="surface-card" style={{ padding: '24px', backgroundColor: 'var(--color-canvas)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem' }}>
                {schedules.length > 0 ? `${t('proposedSchedule')} (${currentScheduleIndex + 1} / ${schedules.length})` : t('proposedSchedule')}
              </h2>
              {schedules.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '6px 16px' }}
                    onClick={() => setCurrentScheduleIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentScheduleIndex === 0}
                  >
                    {t('previous')}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '6px 16px' }}
                    onClick={() => setCurrentScheduleIndex(prev => Math.min(schedules.length - 1, prev + 1))}
                    disabled={currentScheduleIndex === schedules.length - 1}
                  >
                    {t('next')}
                  </button>
                </div>
              )}
            </div>
            
            {schedules.length === 0 ? (
              <div style={{ padding: '64px', textAlign: 'center', color: 'var(--color-muted)' }}>
                {t('emptySchedule')}
              </div>
            ) : (
              <div ref={scheduleRef} style={{ padding: '8px' }}>
                <ScheduleGrid sections={currentSchedule} startHour={8} endHour={18} />
              </div>
            )}

            {schedules.length > 0 && (
              <div className="flex-center" style={{ marginTop: '24px', gap: '16px' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleShare}
                  disabled={isSharing}
                  style={{ backgroundColor: 'var(--color-accent)', color: 'black', border: 'none' }}
                >
                  {isSharing ? '...' : t('shareLink')}
                </button>
                <button className="btn btn-secondary" onClick={() => exportToICS(currentSchedule)}>
                  {t('exportICS')}
                </button>
                <button className="btn btn-secondary" style={{ backgroundColor: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }} onClick={handleExportPNG}>
                  {t('exportPNG')}
                </button>
              </div>
            )}
            {conflicts.length > 0 && (
              <div style={{ marginTop: '32px', padding: '24px', border: '1px solid var(--color-warning)', borderRadius: '12px', backgroundColor: 'var(--color-surface)' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--color-warning)' }}>{t('conflictAnalysis')}</h2>
                <p style={{ color: 'var(--color-muted)', marginBottom: '16px' }}>
                  {t('conflictDescription')}
                </p>
                <ul style={{ listStylePosition: 'inside', lineHeight: '1.8' }}>
                  {conflicts.map((c, i) => {
                    const nameA = selectedCourses.find(sc => sc.code === c.courseA)?.nameAr || c.courseA;
                    const nameB = selectedCourses.find(sc => sc.code === c.courseB)?.nameAr || c.courseB;
                    return (
                      <li key={i}>
                        <strong>{nameA}</strong> {t('conflictsWith')} <strong>{nameB}</strong> <span style={{ color: 'var(--color-muted)' }}>({c.reason})</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
