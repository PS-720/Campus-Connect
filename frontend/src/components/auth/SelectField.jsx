import React from "react";

const SelectField = ({
	label,
	id,
	name,
	value,
	onChange,
	options = [],
	required = false,
	error,
	className = "",
	selectClassName = "",
	disabled = false,
	placeholder = "Select...",
	...props
}) => {
	const selectId = id || name || label?.toLowerCase().replace(/\s+/g, "-");

	return (
		<div className={`flex flex-col gap-2 w-full ${className}`}>
			{label && (
				<label
					htmlFor={selectId}
					className="text-xs font-semibold text-[#8b8da4] tracking-wide">
					{label}
				</label>
			)}

			<div className="relative w-full">
				<select
					id={selectId}
					name={name || selectId}
					value={value}
					onChange={onChange}
					required={required}
					disabled={disabled}
					className={`w-full bg-[#13141b] border ${
						error
							? "border-red-500/80 focus:border-red-500 focus:ring-red-500/20"
							: "border-[#212330] focus:border-[#7c3aed] focus:ring-[#7c3aed]/20"
					} focus:ring-2 focus:outline-none text-white text-sm rounded-xl px-3.5 py-3.5 appearance-none cursor-pointer pr-10 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${selectClassName}`}
					{...props}>
					{placeholder && (
						<option value="" disabled className="bg-[#13141b] text-gray-500">
							{placeholder}
						</option>
					)}
					{options.map((opt) => {
						const val = typeof opt === "object" ? opt.value : opt;
						const labelText = typeof opt === "object" ? opt.label : opt;
						return (
							<option
								key={val}
								value={val}
								className="bg-[#13141b] text-white py-2">
								{labelText}
							</option>
						);
					})}
				</select>

				{/* Custom Dropdown Chevron Icon */}
				<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#6b6e86]">
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</div>
			</div>

			{error && <span className="text-xs text-red-400 mt-0.5">{error}</span>}
		</div>
	);
};

export default SelectField;
