import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider, useAuth, isAltitudeEmail } from '@/src/lib/auth';
import { AuthScreen } from '@/src/components/AuthScreen';
import { PublicFormView } from './components/PublicFormView';
import { App as FormsApp } from './App';
import './index.css';

// Check if the URL is a public form link: /form/:formId
function getPublicFormId(): string | null {
  const match = window.location.pathname.match(/^\/form\/([\w-]+)$/);
  return match ? match[1] : null;
}

function FormsEntry() {
  // Public form route — no auth required, anyone can fill out the form
  const publicFormId = getPublicFormId();
  if (publicFormId) {
    return <PublicFormView formId={publicFormId} />;
  }

  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#eaf0f8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #00a8b5, #008894)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.95)} }`}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthScreen
        title="altitude Forms"
        subtitle="Sign in with your altitude email to access the form builder."
      />
    );
  }

  if (!isAltitudeEmail(user.email || '')) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#eaf0f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🚫</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Access Denied
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '400px', textAlign: 'center' }}>
          Only <strong>@altitude.com</strong> emails can access altitude Forms. Your current email ({user.email}) is not authorized.
        </p>
      </div>
    );
  }

  return <FormsApp />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <FormsEntry />
    </AuthProvider>
  </React.StrictMode>
);
