import React from "react";
import logo from "../../assets/logo.svg";

const BrandLogo = ({
	className = "",
	iconSize = "w-10 h-10 p-2",
	textSize = "text-lg",
	showText = true,
	collapsed = false,
}) => {
	return (
		<div className={`flex items-center gap-3 font-bold select-none ${className}`}>
			<div
				className={`flex items-center justify-center rounded-xl bg-[#804bdf] shadow-md shadow-purple-900/30 shrink-0 ${iconSize}`}>
				<img
					src={logo}
					alt="CampusConnect Logo"
					className="w-full h-full object-contain"
				/>
			</div>

			{showText && !collapsed && (
				<h2 className={`${textSize} tracking-tight font-bold text-white`}>
					CampusConnect <span className="text-[#8b5cf6]">AI</span>
				</h2>
			)}
		</div>
	);
};

export default BrandLogo;
