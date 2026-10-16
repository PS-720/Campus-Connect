import React from "react";
import RegisterForm from "../components/auth/RegisterForm";
import { register } from "../services/authService";

const RegisterPage = ({
	onRegisterSuccess,
	onRegister,
	onNavigateLogin,
	onNavigateToLogin,
}) => {
	const handleRegister = async (formData) => {
		const user = await register(formData);
		if (onRegisterSuccess) onRegisterSuccess(user);
		if (onRegister) onRegister(user);
		return user;
	};

	const handleNavigate = () => {
		if (onNavigateToLogin) onNavigateToLogin();
		else if (onNavigateLogin) onNavigateLogin();
	};

	return (
		<div className="min-h-screen w-full flex bg-[#07080b] text-white justify-center items-center">
			<RegisterForm
				onNavigateToLogin={handleNavigate}
				onRegister={handleRegister}
			/>
		</div>
	);
};

export default RegisterPage;
