import AuthBranding from "../components/auth/AuthBranding";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = ({ onNavigateToRegister, onLogin, onForgotPassword }) => {
	return (
		<div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0a0b0e] text-white">
			<AuthBranding className="hidden lg:flex" />
			<LoginForm
				onNavigateToRegister={onNavigateToRegister}
				onLogin={onLogin}
				onForgotPassword={onForgotPassword}
			/>
		</div>
	);
};

export default LoginPage;

