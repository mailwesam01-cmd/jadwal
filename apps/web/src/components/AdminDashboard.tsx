import React, { useEffect, useState } from 'react';
import { getAdminToken } from '../utils/auth';
import { Building2, BookOpen, Link as LinkIcon, Eye, Activity, Clock } from 'lucide-react';

const formatTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${getAdminToken()}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch stats', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          border: '3px solid rgba(74, 98, 255, 0.2)',
          borderTopColor: 'var(--color-primary)',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!stats) return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: 'rgba(239, 68, 68, 0.1)', 
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '12px',
      color: '#ef4444',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      Failed to load dashboard metrics.
    </div>
  );

  const maxVisits = Math.max(...stats.trafficLast7Days.map((t: any) => t.visits), 10);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .glass-card {
          background: rgba(15, 15, 20, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
        gap: '24px', 
        marginBottom: '40px' 
      }}>
        <StatCard title="Total Universities" value={stats.totalUniversities} icon={<Building2 size={24} />} color="#4A62FF" trend="+12%" />
        <StatCard title="Total Courses" value={stats.totalCourses} icon={<BookOpen size={24} />} color="#10B981" trend="+5%" />
        <StatCard title="Shared Schedules" value={stats.totalSharedSchedules} icon={<LinkIcon size={24} />} color="#F59E0B" trend="+24%" />
        <StatCard title="Total Link Views" value={stats.totalViews} icon={<Eye size={24} />} color="#8B5CF6" trend="+18%" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
        
        {/* Chart Area */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="var(--color-primary)" />
              Traffic Overview
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#a1a1aa', backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px' }}>Last 7 Days</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '240px', gap: '16px', paddingTop: '20px' }}>
            {stats.trafficLast7Days.map((t: any, i: number) => {
              const height = Math.max((t.visits / maxVisits) * 100, 2);
              const isToday = i === stats.trafficLast7Days.length - 1;
              return (
                <div key={t.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <div style={{ 
                    width: '100%', 
                    maxWidth: '48px',
                    height: `${height}%`, 
                    background: isToday ? 'linear-gradient(180deg, var(--color-primary) 0%, rgba(74,98,255,0.2) 100%)' : 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 100%)', 
                    borderRadius: '8px',
                    minHeight: '4px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    cursor: 'pointer',
                    boxShadow: isToday ? '0 0 20px rgba(74,98,255,0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scaleY(1.05)';
                    e.currentTarget.style.background = 'linear-gradient(180deg, var(--color-primary) 0%, rgba(74,98,255,0.3) 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scaleY(1)';
                    e.currentTarget.style.background = isToday ? 'linear-gradient(180deg, var(--color-primary) 0%, rgba(74,98,255,0.2) 100%)' : 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 100%)';
                  }}
                  >
                    <div style={{ 
                      position: 'absolute', 
                      top: '-30px', 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      color: isToday ? '#fff' : '#a1a1aa',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      pointerEvents: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                    className="tooltip"
                    >
                      {t.visits}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: isToday ? '#fff' : '#71717a', fontWeight: isToday ? 600 : 400 }}>{t.day}</span>
                </div>
              );
            })}
          </div>
          <style>{`
            div[group="true"]:hover .tooltip { opacity: 1 !important; }
          `}</style>
        </div>

        {/* Recent Activity */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="#10B981" />
              Recent Activity
            </h3>
          </div>
          
          <div style={{ position: 'relative' }}>
            {/* Timeline line */}
            <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)' }} />
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {stats.recentActivity.map((activity: any) => (
                <li key={activity.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', position: 'relative' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(15,15,20,1)', 
                    border: '2px solid var(--color-primary)', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    boxShadow: '0 0 10px rgba(74,98,255,0.4)'
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
                  </div>
                  <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#e4e4e7' }}>{activity.action}</div>
                      <div style={{ fontSize: '0.75rem', color: '#a1a1aa', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '12px' }}>
                        {formatTimeAgo(activity.time)}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#71717a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={14} />
                      {activity.university}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend }: { title: string, value: number, icon: React.ReactNode, color: string, trend?: string }) => (
  <div className="glass-card" style={{ 
    padding: '24px', 
    display: 'flex', 
    alignItems: 'flex-start', 
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = `0 12px 40px ${color}20`;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
  }}
  >
    {/* Decorative background glow */}
    <div style={{
      position: 'absolute',
      top: '-50%',
      right: '-10%',
      width: '150px',
      height: '150px',
      background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
      borderRadius: '50%',
      filter: 'blur(20px)',
      pointerEvents: 'none'
    }} />

    <div style={{ zIndex: 1 }}>
      <div style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '8px', fontWeight: 500 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>{value.toLocaleString()}</div>
        {trend && (
          <div style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', backgroundColor: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
            {trend}
          </div>
        )}
      </div>
    </div>
    <div style={{ 
      width: '56px', 
      height: '56px', 
      borderRadius: '16px', 
      background: `linear-gradient(135deg, ${color}20, ${color}10)`,
      border: `1px solid ${color}30`,
      color, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 1,
      boxShadow: `0 4px 20px ${color}15`
    }}>
      {icon}
    </div>
  </div>
);
