export default function Loading() {
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
      }}
    >
      <div
        style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      >
        🍸
      </div>
      <p
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#2D3A2E',
        }}
      >
        High Spirits
      </p>
      <p style={{ color: '#7A7568', fontSize: '0.75rem', marginTop: '0.5rem' }}>
        Loading...
      </p>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
