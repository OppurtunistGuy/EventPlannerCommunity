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
    // Print complete stack trace to console
    console.error('[DIAG-ERROR-TSX] ========== ERROR BOUNDARY CAUGHT ==========');
    console.error('[DIAG-ERROR-TSX] Error message:', error?.message);
    console.error('[DIAG-ERROR-TSX] Error digest:', error?.digest);
    console.error('[DIAG-ERROR-TSX] Complete stack trace:');
    console.error(error?.stack);
    console.error('[DIAG-ERROR-TSX] ========== END ERROR BOUNDARY ==========');
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
          marginBottom: '0.5rem',
          maxWidth: '400px',
        }}
      >
        We encountered an unexpected error. The full error details are shown below for debugging.
      </p>
      <div style={{
        background: '#fff3f3',
        border: '1px solid #c0392b',
        borderRadius: 8,
        padding: '12px 16px',
        marginBottom: '1rem',
        maxWidth: '800px',
        width: '100%',
        textAlign: 'left',
        fontSize: '0.75rem',
        fontFamily: 'monospace',
        color: '#c0392b',
        whiteSpace: 'pre-wrap',
        maxHeight: 400,
        overflow: 'auto',
      }}>
        <b>Error:</b> {error?.message}{'\n'}
        <b>Digest:</b> {error?.digest || 'N/A'}{'\n'}
        <b>Complete Stack Trace:</b>{'\n'}{error?.stack || 'No stack trace available'}
      </div>
      <button
        onClick={() => { console.log('[DIAG] Try Again clicked'); reset(); }}
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
