import React from "react";

const InputField = ({
	label,
	id,
	name,
	type = "text",
	placeholder,
	value,
	onChange,
	required = false,
	error,
	autoComplete,
	className = "",
	inputClassName = "",
	rightElement,
	disabled = false,
	...props
}) => {
	const inputId = id || name || label?.toLowerCase().replace(/\s+/g, "-");

	return (
		<div className={`flex flex-col gap-2 w-full ${className}`}>
			<div className="flex justify-between items-center">
				{label && (
					<label
						htmlFor={inputId}
						className="text-xs font-semibold text-[#8b8da4] tracking-wide">
						{label}
					</label>
				)}
				{rightElement && (
					<div className="text-xs">{rightElement}</div>
				)}
			</div>

			<div className="relative w-full">
				<input
					id={inputId}
					name={name || inputId}
					type={type}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					required={required}
					autoComplete={autoComplete}
					disabled={disabled}
					className={`w-full bg-[#13141b] border ${
						error ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/20" : "border-[#212330] focus:border-[#7c3aed] focus:ring-[#7c3aed]/20"
					} focus:ring-2 focus:outline-none text-white text-sm placeholder-[#4b4d63] rounded-xl px-4 py-3.5 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
					{...props}
				/>
			</div>

			{error && (
				<span className="text-xs text-red-400 mt-0.5">{error}</span>
			)}
		</div>
	);
};

export default InputField;
