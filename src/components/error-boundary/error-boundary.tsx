import { Component, type ReactNode } from 'react';
import { Result, Button } from 'antd';
import { LuRefreshCw, LuCircleAlert } from 'react-icons/lu';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (!hasError) {
      return children;
    }

    if (fallback) {
      return fallback;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Result
          icon={<LuCircleAlert className="text-red-500 text-6xl mx-auto" />}
          status="error"
          title="Algo salió mal"
          subTitle={
            error?.message ||
            'Ocurrió un error inesperado. Intenta recargar la página o contacta soporte si el problema persiste.'
          }
          extra={
            <Button
              key="reload"
              type="primary"
              icon={<LuRefreshCw size={16} />}
              onClick={() => window.location.reload()}
              className="rounded-lg bg-indigo-500! border-indigo-500!"
            >
              Intentar de nuevo
            </Button>
          }
        />
      </div>
    );
  }
}
