import logo from "../../assets/logo.svg";

const BrandLogo = () => {
	return (
		<div className="flex items-center gap-3 font-bold text-lg w-fit">
			<img
				src={logo}
				alt="Campus-Connect Logo"
				className="w-12 p-3 rounded-xl bg-purple-700"
			/>

			<h2>Campus Connect AI</h2>
		</div>
	);
};

export default BrandLogo;
