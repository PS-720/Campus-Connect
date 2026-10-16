import React from "react";
import AuthBranding from "../components/auth/AuthBranding";
import LoginForm from "../components/auth/LoginForm";
import { login } from "../services/authService";

const LoginPage = ({
	onLoginSuccess,
	onLogin,
	onNavigateRegister,
	onNavigateToRegister,
	onForgotPassword,
}) => {
	const handleLogin = async (credentials) => {
		const user = await login(credentials);
		if (onLoginSuccess) onLoginSuccess(user);
		if (onLogin) onLogin(user);
		return user;
	};

	const handleNavigate = () => {
		if (onNavigateToRegister) onNavigateToRegister();
		else if (onNavigateRegister) onNavigateRegister();
	};

	return (
		<div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0a0b0e] text-white">
			<AuthBranding className="hidden lg:flex" />
			<LoginForm
				onNavigateToRegister={handleNavigate}
				onLogin={handleLogin}
				onForgotPassword={onForgotPassword}
			/>
		</div>
	);
};

export default LoginPage;
