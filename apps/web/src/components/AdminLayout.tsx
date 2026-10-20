import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useI18n } from '../i18nContext';
import { getAdminToken, setAdminToken } from '../utils/auth';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarDays, 
  Settings, 
  LogOut, 
  Globe, 
  ChevronRight, 
  ChevronLeft,
  Bell
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { direction, locale } = useI18n();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Prevent Back/Forward Cache (BFCache) from bypassing login
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setAdminToken(null);
        window.location.reload();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const navItems = [
    { name: 'Dashboard', arName: 'لوحة التحكم', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Universities', arName: 'الجامعات', path: '/admin/universities', icon: <Building2 size={20} /> },
    { name: 'Schedules', arName: 'الجداول المشتركة', path: '/admin/schedules', icon: <CalendarDays size={20} /> },
    { name: 'Settings', arName: 'الإعدادات', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  if (!getAdminToken()) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    setAdminToken(null);
    window.location.href = '/admin/login';
  };

  const isRtl = direction === 'rtl';

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#050505', 
      color: '#FAFAFA', 
      fontFamily: 'var(--font-primary)',
      backgroundImage: 'radial-gradient(circle at 50% 0%, #1a1a24 0%, transparent 70%)'
    }}>
      {/* Sidebar */}
      <aside style={{ 
        width: isCollapsed ? '80px' : '260px', 
        backgroundColor: 'rgba(10, 10, 12, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRight: isRtl ? 'none' : '1px solid rgba(255, 255, 255, 0.08)', 
        borderLeft: isRtl ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
        display: 'flex', 
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            position: 'absolute',
            top: '32px',
            [isRtl ? 'left' : 'right']: '-14px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#18181b',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#a1a1aa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}
        >
          {isRtl 
            ? (isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />)
            : (isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />)
          }
        </button>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          margin: '24px 16px 40px', 
          padding: '0 8px',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            minWidth: '36px',
            background: 'linear-gradient(135deg, var(--color-primary), #8B5CF6)', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(74, 98, 255, 0.3)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <span style={{ 
            fontSize: '1.25rem', 
            fontWeight: 800, 
            letterSpacing: '-0.02em',
            opacity: isCollapsed ? 0 : 1,
            transition: 'opacity 0.2s',
            display: isCollapsed ? 'none' : 'block'
          }}>
            Jadwal
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px' }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path}
                title={locale === 'ar' ? item.arName : item.name}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '12px 14px', 
                  textDecoration: 'none', 
                  color: isActive ? '#fff' : '#a1a1aa',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                  borderRadius: '8px',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s ease',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.color = '#e4e4e7';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#a1a1aa';
                  }
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    [isRtl ? 'right' : 'left']: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '16px',
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: isRtl ? '4px 0 0 4px' : '0 4px 4px 0',
                  }} />
                )}
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: isActive ? 'var(--color-primary)' : 'inherit'
                }}>
                  {item.icon}
                </span>
                <span style={{ 
                  fontSize: '0.95rem',
                  opacity: isCollapsed ? 0 : 1,
                  transition: 'opacity 0.2s',
                  display: isCollapsed ? 'none' : 'block'
                }}>
                  {locale === 'ar' ? item.arName : item.name}
                </span>
              </Link>
            )
          })}
        </nav>

        <div style={{ 
          marginTop: 'auto', 
          padding: '24px 16px',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px' 
        }}>
          {!isCollapsed && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              color: '#10B981',
              fontSize: '0.85rem',
              fontWeight: 500
            }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                backgroundColor: '#10B981', 
                borderRadius: '50%',
                boxShadow: '0 0 8px #10B981'
              }} />
              System Online
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ 
          height: '76px', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
          backgroundColor: 'rgba(5, 5, 5, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 5
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
              {navItems.find(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.name || 'Overview'}
            </h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link 
              to="/" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                color: '#a1a1aa', 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}
            >
              <Globe size={16} />
              {locale === 'ar' ? 'الموقع' : 'Live Site'}
            </Link>
            
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <button style={{ 
              background: 'none', 
              border: 'none', 
              color: '#a1a1aa', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}
            >
              <Bell size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 600,
                color: 'var(--color-primary)'
              }}>
                A
              </div>
              
              <button 
                onClick={handleLogout}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid rgba(239, 68, 68, 0.2)', 
                  color: '#ef4444', 
                  padding: '8px', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                title="Logout"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
