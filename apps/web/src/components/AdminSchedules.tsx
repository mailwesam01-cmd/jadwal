import React, { useEffect, useState } from 'react';
import { getAdminToken } from '../utils/auth';
import { Search, CalendarDays, Eye, ExternalLink, Link as LinkIcon, Trash2 } from 'lucide-react';

export const AdminSchedules: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/admin/schedules', {
      headers: { 'Authorization': `Bearer ${getAdminToken()}` }
    })
      .then(res => res.json())
      .then(data => {
        setSchedules(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredSchedules = schedules.filter(s => 
    s.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .glass-panel {
          background: rgba(15, 15, 20, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        .table-row {
          transition: background-color 0.2s, transform 0.2s;
        }
        .table-row:hover {
          background-color: rgba(255, 255, 255, 0.03);
        }
      `}</style>

      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CalendarDays size={28} color="#F59E0B" />
          Shared Schedules
        </h2>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ 
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={18} color="#71717a" style={{ position: 'absolute', left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search by slug..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '10px 16px 10px 40px',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                width: '260px',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#F59E0B';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Slug ID</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Views</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sections</th>
                <th style={{ padding: '16px 24px', width: '120px', fontWeight: 600, color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map(s => (
                  <tr key={s.id} className="table-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LinkIcon size={16} color="#71717a" />
                        <span style={{ 
                          fontFamily: 'monospace',
                          fontSize: '0.95rem',
                          color: '#e4e4e7',
                          fontWeight: 500
                        }}>
                          {s.slug}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Eye size={16} color="#8B5CF6" />
                        <span style={{ fontWeight: 600, color: '#e4e4e7' }}>{s.views.toLocaleString()}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        backgroundColor: 'rgba(255,255,255,0.05)', 
                        padding: '4px 10px', 
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        color: '#a1a1aa',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        {s.sectionIds.length} sections
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <a 
                          href={`/s/${s.slug}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: 'rgba(245,158,11,0.1)',
                            color: '#F59E0B',
                            textDecoration: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            border: '1px solid rgba(245,158,11,0.2)',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(245,158,11,0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(245,158,11,0.1)'}
                        >
                          View <ExternalLink size={14} />
                        </a>
                        <button style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#71717a',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'color 0.2s, background-color 0.2s'
                        }}
                        title="Delete Schedule"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#ef4444';
                          e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#71717a';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: '#71717a' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <CalendarDays size={40} color="rgba(255,255,255,0.1)" />
                      <p>No schedules found matching "{searchQuery}"</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
