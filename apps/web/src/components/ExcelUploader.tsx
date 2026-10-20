import React, { useState, useRef } from 'react';
import { useI18n } from '../i18nContext';
import './ExcelUploader.css';

interface ExcelUploaderProps {
  onSuccess: () => void;
}

export const ExcelUploader: React.FC<ExcelUploaderProps> = ({ onSuccess }) => {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError(t('invalidExcel'));
      return;
    }

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/import/ttu/excel', {
        method: 'POST',
        body: formData, // fetch will automatically set Content-Type to multipart/form-data
      });

      if (res.ok) {
        onSuccess();
        alert(t('importSuccess'));
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        const errData = await res.json();
        setError(errData.message || t('uploadError'));
      }
    } catch (err) {
      setError(t('connectionFailed'));
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="excel-uploader-container">
      <div 
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="drop-zone-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <div className="drop-zone-text">
          {isUploading ? (
            <span style={{ color: 'var(--color-primary)' }}>{t('uploading')}</span>
          ) : (
            <>
              <strong>{t('clickToUpload')}</strong> {t('orDragDrop')}
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '4px' }}>
                {t('supportsExcel')}
              </div>
            </>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".xlsx, .xls"
          style={{ display: 'none' }}
        />
      </div>
      {error && <div className="uploader-error">{error}</div>}
    </div>
  );
};
