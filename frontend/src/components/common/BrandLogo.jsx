import React from "react";
import logo from "../../assets/logo.svg";

const BrandLogo = ({ className = "", collapsed = false }) => {
	return (
		<div className={`flex items-center gap-3 font-bold select-none ${className}`}>
			<div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#804bdf] shadow-lg shadow-purple-900/40 shrink-0 p-2.5">
				<img
					src={logo}
					alt="CampusConnect Logo"
					className="w-full h-full object-contain"
				/>
			</div>

			{!collapsed && (
				<div className="flex flex-col">
					<span className="text-base font-bold text-white tracking-tight leading-tight">
						CampusConnect
					</span>
					<span className="text-[11px] font-semibold text-[#8b5cf6] tracking-wider -mt-0.5">
						AI
					</span>
				</div>
			)}
		</div>
	);
};

export default BrandLogo;
