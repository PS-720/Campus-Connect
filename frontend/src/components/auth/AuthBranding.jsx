import BrandLogo from "../common/BrandLogo";
import checkIcon from "../../assets/check.svg";

const features = [
	"Private social network for your college",
	"AI-powered study tools",
	"Notes sharing & communities",
	"Real-time events & messaging",
];

const AuthBranding = () => {
	return (
		<div className="min-h-screen bg-[#0d0e12] [background:radial-gradient(circle_at_25%_30%,#302050_0%,#171522_35%,#0d0e12_70%)] flex flex-col gap-10 justify-center w-[70%] shrink-0 px-12">
			<BrandLogo />
			<div>
				<h1 className="max-w-sm text-4xl font-bold mb-6">
					The digital campus students actually want to use.
				</h1>
				<p className="text-[#8b8da4]">
					Connect with your campus, share knowledge, attend events, and
					supercharge your studies with AI - all in one place.
				</p>
			</div>

			<ul>
				{features.map((feature) => (
					<li
						className="flex items-center gap-3 space-y-2 text-sm text-[#c8caca]"
						key={feature}>
						<div className="w-5 h-5 shrink-0 flex items-center justify-center rounded-full bg-[#153635]">
							<img src={checkIcon} alt="" className="w-3.5" />
						</div>
						<span>{feature}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default AuthBranding;
