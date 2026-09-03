import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { ReactFlowProvider } from '@xyflow/react';
import { App } from './App';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in CloudTopology CPQ:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B0F19', color: '#F3F4F6', fontFamily: 'sans-serif', padding: '24px' }}>
          <div style={{ maxWidth: '500px', width: '100%', background: '#111827', border: '1px solid #374151', borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#EF4444' }}>Canvas Encountered an Issue</h2>
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '20px', lineHeight: '1.5' }}>
              {this.state.error?.message || 'An unexpected state error occurred.'}
            </p>
            <button
              onClick={this.handleReset}
              style={{ padding: '10px 20px', backgroundColor: '#2563EB', color: 'white', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Reset Canvas & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
