import React, { Component, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(_: Error): ErrorBoundaryState {
		// 에러 발생 시 상태 업데이트
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// 에러 로깅 등 추가 작업 가능
		console.error("Uncaught error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			// 에러가 발생했을 때 에러 페이지로 리다이렉트
			return <Navigate to="/error" replace />;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
