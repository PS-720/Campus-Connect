import BrandLogo from "../common/BrandLogo";
import checkIcon from "../../assets/check.svg";

const features = [
	"Private social network for your college",
	"AI-powered study tools",
	"Notes sharing & communities",
	"Real-time events & messaging",
];

const AuthBranding = ({ className = "" }) => {
	return (
		<div
			className={`min-h-screen bg-[#0d0e12] [background:radial-gradient(circle_at_25%_30%,#302050_0%,#171522_35%,#0d0e12_70%)] flex flex-col justify-center gap-10 w-full lg:w-[54%] xl:w-[58%] shrink-0 px-8 sm:px-12 md:px-16 lg:px-20 ${className}`}>
			<BrandLogo />
			<div className="max-w-md">
				<h1 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight tracking-tight">
					The digital campus students actually want to use.
				</h1>
				<p className="text-[#8b8da4] text-base leading-relaxed">
					Connect with your campus, share knowledge, attend events, and
					supercharge your studies with AI — all in one place.
				</p>
			</div>

			<ul className="flex flex-col gap-3.5">
				{features.map((feature) => (
					<li
						className="flex items-center gap-3 text-sm text-[#c8caca]"
						key={feature}>
						<div className="w-5 h-5 shrink-0 flex items-center justify-center rounded-full bg-[#123832] border border-[#1b5e52]">
							<img src={checkIcon} alt="" className="w-3" />
						</div>
						<span>{feature}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default AuthBranding;
