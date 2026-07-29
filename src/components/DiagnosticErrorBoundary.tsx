'use client';

import { Component } from 'react';

interface EBState { hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }

export class DiagnosticErrorBoundary extends Component<{ children: React.ReactNode }, EBState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[DIAG-EB] Error boundary caught render error:', error.message, error.stack);
    console.error('[DIAG-EB] Component stack:', info.componentStack);
    this.setState({ errorInfo: info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', background: '#fff3f3', color: '#c0392b', minHeight: '100vh' }}>
          <h2>[DIAG] Render Error Caught</h2>
          <p><b>Message:</b> {this.state.error?.message}</p>
          <h3>Stack Trace:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, maxHeight: 200, overflow: 'auto', background: '#fff', padding: 12, borderRadius: 8 }}>
            {this.state.error?.stack}
          </pre>
          <h3>Component Stack:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, maxHeight: 200, overflow: 'auto', background: '#fff', padding: 12, borderRadius: 8 }}>
            {this.state.errorInfo?.componentStack}
          </pre>
          <button onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })} style={{ marginTop: 12, padding: '8px 16px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
