import React, { useState } from "react";
import BrandLogo from "../common/BrandLogo";
import InputField from "./InputField";
import PasswordField from "./PasswordField";

const LoginForm = ({
	onLogin,
	onForgotPassword,
	onNavigateToRegister,
}) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const validateForm = () => {
		const newErrors = {};
		if (!email.trim()) {
			newErrors.email = "College email is required";
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = "Please enter a valid college email address";
		}

		if (!password) {
			newErrors.password = "Password is required";
		} else if (password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsLoading(true);
		try {
			if (onLogin) {
				await onLogin({ email, password, rememberMe });
			} else {
				// Default demo behavior
				console.log("Login attempt:", { email, password, rememberMe });
			}
		} catch (err) {
			setErrors({ general: err.message || "Failed to sign in" });
		} finally {
			setIsLoading(false);
		}
	};

	const handleForgotPwd = () => {
		if (onForgotPassword) {
			onForgotPassword(email);
		} else {
			console.log("Forgot password clicked");
		}
	};

	const handleRegisterRedirect = () => {
		if (onNavigateToRegister) {
			onNavigateToRegister();
		} else {
			console.log("Navigate to register clicked");
		}
	};

	return (
		<div className="w-full lg:w-[46%] min-h-screen bg-[#0a0b0e] flex flex-col justify-center items-center px-6 sm:px-12 py-12 relative">
			<div className="w-full max-w-[420px] flex flex-col items-center">
				{/* Brand Logo Header */}
				<BrandLogo
					className="justify-center mb-6"
					iconSize="w-10 h-10 p-2"
					textSize="text-lg"
				/>

				{/* Headings */}
				<h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight text-center mb-1.5">
					Welcome back
				</h1>
				<p className="text-sm text-[#8b8da4] text-center mb-8">
					Sign in to your campus account
				</p>

				{/* General Error Banner */}
				{errors.general && (
					<div className="w-full mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
						<svg
							className="w-4 h-4 shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						<span>{errors.general}</span>
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
					<InputField
						label="College Email"
						id="college-email"
						name="email"
						type="email"
						placeholder="you@college.edu"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
						}}
						error={errors.email}
						autoComplete="email"
						required
					/>

					<PasswordField
						label="Password"
						id="password"
						name="password"
						placeholder="••••••••"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
							if (errors.password)
								setErrors((prev) => ({ ...prev, password: null }));
						}}
						error={errors.password}
						onForgotPassword={handleForgotPwd}
						required
					/>

					{/* Remember me Checkbox */}
					<div className="flex items-center justify-between pt-1 pb-1">
						<label className="flex items-center gap-2.5 cursor-pointer text-sm text-[#8b8da4] hover:text-[#c4c6dc] transition-colors select-none">
							<input
								type="checkbox"
								checked={rememberMe}
								onChange={(e) => setRememberMe(e.target.checked)}
								className="w-4 h-4 rounded border-[#27293a] bg-[#13141b] text-[#7c3aed] accent-[#7c3aed] focus:ring-0 focus:outline-none cursor-pointer"
							/>
							<span>Remember me</span>
						</label>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-3.5 px-4 mt-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-lg shadow-purple-900/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center">
						{isLoading ? (
							<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
						) : (
							"Sign In"
						)}
					</button>
				</form>

				{/* Sign up Link */}
				<p className="text-center text-sm text-[#71748d] mt-8">
					Don't have an account?{" "}
					<button
						type="button"
						onClick={handleRegisterRedirect}
						className="text-[#8b5cf6] hover:text-[#a78bfa] font-medium transition-colors cursor-pointer focus:outline-none focus:underline">
						Create account
					</button>
				</p>
			</div>
		</div>
	);
};

export default LoginForm;