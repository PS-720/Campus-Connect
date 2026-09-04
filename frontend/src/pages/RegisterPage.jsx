import React from "react";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = ({ onNavigateToLogin, onRegister }) => {
	return (
		<div className="min-h-screen w-full flex bg-[#07080b] text-white">
			<RegisterForm
				onNavigateToLogin={onNavigateToLogin}
				onRegister={onRegister}
			/>
		</div>
	);
};

export default RegisterPage;
