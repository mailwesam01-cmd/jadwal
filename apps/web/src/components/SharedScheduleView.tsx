import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ScheduleGrid } from './ScheduleGrid';
import { useI18n } from '../i18nContext';
import html2canvas from 'html2canvas';

export const SharedScheduleView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { locale, direction } = useI18n();
  const scheduleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [direction, locale]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`/api/schedules/${slug}`);
        if (!res.ok) {
          throw new Error('Schedule not found or expired');
        }
        const data = await res.json();
        setScheduleData(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchSchedule();
  }, [slug]);

  const handleExportPng = async () => {
    if (!scheduleRef.current) return;
    try {
      const canvas = await html2canvas(scheduleRef.current, {
        scale: 2,
        backgroundColor: '#F5F5FA',
        useCORS: true
      });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `Jadwal-${slug}.png`;
      a.click();
    } catch (err) {
      console.error('Failed to export PNG', err);
      alert(locale === 'ar' ? 'فشل تصدير الصورة' : 'Failed to export image');
    }
  };

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', padding: '24px' }}>
        <h1 style={{ color: 'var(--color-conflict)', marginBottom: '16px' }}>{locale === 'ar' ? 'عذراً، الجدول غير موجود' : 'Sorry, Schedule Not Found'}</h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: '24px' }}>{error}</p>
        <Link to="/" style={{ padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          {locale === 'ar' ? 'اصنع جدولك الخاص' : 'Create Your Own Schedule'}
        </Link>
      </div>
    );
  }

  if (!scheduleData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)' }}>
        <p>{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-primary)' }}>
      <header style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>Jadwal</span>
            <span style={{ fontSize: '1.2rem', opacity: 0.3, padding: '0 4px', fontWeight: 300 }}>|</span>
            <span style={{ fontWeight: 800, fontSize: '1.5rem', paddingBottom: '2px' }}>جدول</span>
          </div>
        </Link>
        <Link to="/" style={{ padding: '8px 16px', backgroundColor: 'var(--color-accent)', color: 'black', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
          {locale === 'ar' ? 'اصنع جدولك الخاص' : 'Create Your Schedule'}
        </Link>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text)' }}>
              {locale === 'ar' ? 'جدول مشارك' : 'Shared Schedule'}
            </h1>
            <p style={{ color: 'var(--color-muted)' }}>
              {locale === 'ar' ? `الفصل: ${scheduleData.termId}` : `Term: ${scheduleData.termId}`}
            </p>
          </div>
          <button 
            onClick={handleExportPng}
            style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            {locale === 'ar' ? 'حفظ كصورة' : 'Save as Image'}
          </button>
        </div>

        <div ref={scheduleRef} style={{ backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <ScheduleGrid sections={scheduleData.sections} />
        </div>
      </main>
    </div>
  );
};
