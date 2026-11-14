import React from "react";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen bg-[#07080b] text-white flex flex-col items-center justify-center p-6 text-center">
					<div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
						<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</div>
					<h2 className="text-xl font-bold mb-2">Something went wrong</h2>
					<p className="text-sm text-[#8b8da4] max-w-md mb-6">
						An unexpected error occurred. Click below to reload the application.
					</p>
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-purple-900/30">
						Reload Page
					</button>
				</div>
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
