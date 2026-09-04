import AuthBranding from "../components/auth/AuthBranding";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
	return (
		<div className="h-full flex">
			<AuthBranding />
			<LoginForm />
		</div>
	);
};

export default LoginPage;
