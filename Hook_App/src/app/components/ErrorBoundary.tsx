import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center" style={{ background: '#fdfcfb' }}>
          <div className="text-5xl mb-4">💔</div>
          <h2 className="font-black text-foreground text-xl mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
            className="px-6 py-3 rounded-2xl font-bold text-white text-sm shadow-lg"
            style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)' }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
