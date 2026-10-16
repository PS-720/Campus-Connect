import React, { useState } from "react";
import BrandLogo from "../common/BrandLogo";
import InputField from "./InputField";
import PasswordField from "./PasswordField";
import SelectField from "./SelectField";

const AVAILABLE_INTERESTS = [
	"Coding",
	"AI/ML",
	"Design",
	"Photography",
	"Music",
	"Sports",
	"Research",
	"Entrepreneurship",
	"Gaming",
	"Writing",
];

const DEPARTMENT_OPTIONS = [
	"Computer Science",
	"Information Technology",
	"Electrical Engineering",
	"Electronics & Comm.",
	"Mechanical Engineering",
	"Civil Engineering",
	"Data Science & AI",
	"Business Administration",
	"Biotechnology",
];

const YEAR_OPTIONS = [
	"1st Year",
	"2nd Year",
	"3rd Year",
	"4th Year",
	"5th Year",
	"Graduate",
];

const RegisterForm = ({ onRegister, onNavigateToLogin }) => {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [department, setDepartment] = useState("Computer Science");
	const [year, setYear] = useState("1st Year");
	const [selectedInterests, setSelectedInterests] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const toggleInterest = (interest) => {
		setSelectedInterests((prev) =>
			prev.includes(interest)
				? prev.filter((item) => item !== interest)
				: [...prev, interest]
		);
	};

	const validateForm = () => {
		const newErrors = {};
		if (!fullName.trim()) {
			newErrors.fullName = "Full name is required";
		}

		if (!email.trim()) {
			newErrors.email = "College email is required";
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = "Please enter a valid college email address";
		}

		if (!password) {
			newErrors.password = "Password is required";
		} else if (password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		}

		if (!department) {
			newErrors.department = "Please select your department";
		}

		if (!year) {
			newErrors.year = "Please select your year";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsLoading(true);
		try {
			const formData = {
				fullName,
				email,
				password,
				department,
				year,
				interests: selectedInterests,
			};

			if (onRegister) {
				await onRegister(formData);
			} else {
				console.log("Account created:", formData);
			}
		} catch (err) {
			setErrors({ general: err.message || "Failed to create account" });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full min-h-screen bg-[#07080b] flex flex-col justify-center items-center px-4 sm:px-6 py-12">
			<div className="w-full max-w-[480px] flex flex-col items-center">
				{/* Brand Logo Header */}
				<BrandLogo
					className="justify-center mb-6"
					iconSize="w-10 h-10 p-2"
					textSize="text-lg"
				/>

				{/* Headings */}
				<h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight text-center mb-1.5">
					Create your account
				</h1>
				<p className="text-sm text-[#8b8da4] text-center mb-8">
					Join your campus community today
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

				{/* Card Form */}
				<div className="w-full bg-[#0d0f15] border border-[#1c1e2a] rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/60">
					<form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
						{/* Full Name */}
						<InputField
							label="Full Name"
							id="full-name"
							name="fullName"
							placeholder="Alex Chen"
							value={fullName}
							onChange={(e) => {
								setFullName(e.target.value);
								if (errors.fullName)
									setErrors((prev) => ({ ...prev, fullName: null }));
							}}
							error={errors.fullName}
							autoComplete="name"
							required
						/>

						{/* College Email */}
						<InputField
							label="College Email"
							id="college-email"
							name="email"
							type="email"
							placeholder="you@college.edu"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								if (errors.email)
									setErrors((prev) => ({ ...prev, email: null }));
							}}
							error={errors.email}
							autoComplete="email"
							required
						/>

						{/* Password */}
						<PasswordField
							label="Password"
							id="password"
							name="password"
							placeholder="Min 8 characters"
							forgotPasswordText=""
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								if (errors.password)
									setErrors((prev) => ({ ...prev, password: null }));
							}}
							error={errors.password}
							autoComplete="new-password"
							required
						/>

						{/* Department and Year Row */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
							<SelectField
								label="Department"
								id="department"
								name="department"
								value={department}
								onChange={(e) => {
									setDepartment(e.target.value);
									if (errors.department)
										setErrors((prev) => ({ ...prev, department: null }));
								}}
								options={DEPARTMENT_OPTIONS}
								error={errors.department}
								required
							/>

							<SelectField
								label="Year"
								id="year"
								name="year"
								value={year}
								onChange={(e) => {
									setYear(e.target.value);
									if (errors.year)
										setErrors((prev) => ({ ...prev, year: null }));
								}}
								options={YEAR_OPTIONS}
								error={errors.year}
								required
							/>
						</div>

						{/* Interests Chips */}
						<div className="flex flex-col gap-2.5 mt-1">
							<label className="text-xs font-semibold text-[#8b8da4] tracking-wide">
								Interests (select a few)
							</label>

							<div className="flex flex-wrap gap-2">
								{AVAILABLE_INTERESTS.map((interest) => {
									const isSelected = selectedInterests.includes(interest);
									return (
										<button
											type="button"
											key={interest}
											onClick={() => toggleInterest(interest)}
											className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer select-none ${
												isSelected
													? "bg-[#7c3aed]/25 text-[#c4b5fd] border border-[#7c3aed] shadow-sm shadow-purple-900/30"
													: "bg-[#14151e] text-[#787b92] border border-[#202230] hover:text-[#c4c6dc] hover:border-[#303348]"
											}`}>
											{interest}
										</button>
									);
								})}
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full py-3.5 px-4 mt-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-lg shadow-purple-900/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center">
							{isLoading ? (
								<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							) : (
								"Create Account"
							)}
						</button>
					</form>
				</div>

				{/* Sign in Link */}
				<p className="text-center text-sm text-[#71748d] mt-6">
					Already have an account?{" "}
					<button
						type="button"
						onClick={onNavigateToLogin}
						className="text-[#8b5cf6] hover:text-[#a78bfa] font-medium transition-colors cursor-pointer focus:outline-none focus:underline ml-1">
						Sign in
					</button>
				</p>
			</div>
		</div>
	);
};

export default RegisterForm;
