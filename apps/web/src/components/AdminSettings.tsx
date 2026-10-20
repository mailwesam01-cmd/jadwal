import React from 'react';
import { Settings as SettingsIcon, Shield, Key, BellRing, Save } from 'lucide-react';

export const AdminSettings: React.FC = () => {
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
        .form-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 10px;
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #a1a1aa;
          font-size: 0.95rem;
          transition: all 0.2s;
          outline: none;
        }
        .form-input:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .toggle-switch {
          position: relative;
          width: 44px;
          height: 24px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          cursor: not-allowed;
          transition: background-color 0.2s;
        }
        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background-color: #71717a;
          border-radius: 50%;
          transition: transform 0.2s;
        }
        .toggle-switch[data-active="true"] {
          background-color: var(--color-primary);
        }
        .toggle-switch[data-active="true"]::after {
          transform: translateX(20px);
          background-color: #fff;
        }
      `}</style>

      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SettingsIcon size={28} color="#a1a1aa" />
          System Settings
        </h2>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Security Settings */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
            <div style={{ padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: '#ef4444' }}>
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>Security Settings</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#71717a', marginTop: '4px' }}>Change admin password and access control.</p>
            </div>
          </div>
          
          <div style={{ padding: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', marginBottom: '24px', color: '#F59E0B', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Key size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>Settings functionality is currently disabled in this demo version. It will be implemented in the final release.</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#e4e4e7', fontSize: '0.9rem', fontWeight: 500 }}>Current Password</label>
              <input className="form-input" disabled type="password" placeholder="••••••••" value="password" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#e4e4e7', fontSize: '0.9rem', fontWeight: 500 }}>New Password</label>
              <input className="form-input" disabled type="password" placeholder="Enter new password" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#e4e4e7', fontSize: '0.9rem', fontWeight: 500 }}>Confirm New Password</label>
              <input className="form-input" disabled type="password" placeholder="Confirm new password" />
            </div>
            
            <button disabled style={{ 
              marginTop: '8px',
              padding: '14px', 
              borderRadius: '10px', 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              color: '#71717a', 
              border: '1px solid rgba(255,255,255,0.05)', 
              fontWeight: 600, 
              cursor: 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.95rem'
            }}>
              <Save size={18} />
              Save Password Changes
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
            <div style={{ padding: '8px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#3b82f6' }}>
              <BellRing size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>System Preferences</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#71717a', marginTop: '4px' }}>Manage notifications and global options.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#e4e4e7' }}>Email Notifications</div>
                <div style={{ fontSize: '0.85rem', color: '#71717a', marginTop: '4px' }}>Receive alerts when system needs attention</div>
              </div>
              <div className="toggle-switch" data-active="true" />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#e4e4e7' }}>Maintenance Mode</div>
                <div style={{ fontSize: '0.85rem', color: '#71717a', marginTop: '4px' }}>Temporarily disable public access</div>
              </div>
              <div className="toggle-switch" data-active="false" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#e4e4e7' }}>Analytics Tracking</div>
                <div style={{ fontSize: '0.85rem', color: '#71717a', marginTop: '4px' }}>Allow collection of usage statistics</div>
              </div>
              <div className="toggle-switch" data-active="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
