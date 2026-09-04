import logo from "../../assets/logo.svg";

const BrandLogo = ({ className = "", iconSize = "w-11 h-11 p-2.5", textSize = "text-xl", showText = true }) => {
	return (
		<div className={`flex items-center gap-3 font-bold ${className}`}>
			<div className={`flex items-center justify-center rounded-xl bg-[#804bdf] shadow-md shadow-purple-900/30 shrink-0 ${iconSize}`}>
				<img
					src={logo}
					alt="CampusConnect Logo"
					className="w-full h-full object-contain"
				/>
			</div>

			{showText && <h2 className={`${textSize} tracking-tight font-bold text-white`}>CampusConnect AI</h2>}
		</div>
	);
};

export default BrandLogo;

