import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  blockName: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class BlockErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[DynamicBlock Error] in <${this.props.blockName}>:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Ở chế độ Dev / Preview -> Hiển thị cảnh báo để editor biết
      if (import.meta.env.DEV || (typeof window !== 'undefined' && window.location.search.includes('preview=1'))) {
        return (
          <div className="my-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-800 text-sm">
            <strong>Block Render Error ({this.props.blockName}):</strong> {this.state.error?.message}
          </div>
        );
      }
      // Ở môi trường Production thực tế -> Ẩn khối lỗi để không vỡ giao diện
      return null;
    }

    return this.props.children;
  }
}