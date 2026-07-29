'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[DIAG] Error boundary caught:', error?.message, error?.stack);
    // Make it visible in the page too for debugging
    try {
      const diagEl = document.createElement('div');
      diagEl.id = 'diag-error';
      diagEl.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#c0392b;color:#fff;padding:8px 16px;font-size:12px;z-index:99999;white-space:pre-wrap;max-height:120px;overflow:auto;';
      diagEl.textContent = `[DIAG] ${error?.message}\n${error?.stack?.split('\n').slice(0,5).join('\n')}`;
      document.body.appendChild(diagEl);
    } catch {}
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif',
        background: '#FDFBF7',
        color: '#1A1A1A',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '3rem',
          marginBottom: '1rem',
        }}
      >
        🍸
      </div>
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          color: '#7A7568',
          fontSize: '0.875rem',
          marginBottom: '1.5rem',
          maxWidth: '400px',
        }}
      >
        We encountered an unexpected error. Please try refreshing the page.
      </p>
      <button
        onClick={reset}
        style={{
          padding: '0.625rem 1.5rem',
          background: '#2D3A2E',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Try Again
      </button>
    </div>
  );
}
