import React from "react";

const getCategoryBadgeColor = (category) => {
	switch (category?.toLowerCase()) {
		case "technology":
			return "bg-[#241747]/90 text-[#c4b5fd] border-[#3e2b70]";
		case "arts":
			return "bg-[#382313]/90 text-[#fb923c] border-[#5a361c]";
		case "business":
			return "bg-[#122e1e]/90 text-[#4ade80] border-[#1d5939]";
		case "sports":
			return "bg-[#382012]/90 text-[#f59e0b] border-[#553018]";
		default:
			return "bg-[#181926]/90 text-[#a78bfa] border-[#292b40]";
	}
};

const CommunityCard = ({ community, onToggleJoin }) => {
	const { id, name, members, category, description, image, icon, isJoined } =
		community;

	return (
		<div className="flex flex-col bg-[#0d0f15] border border-[#1b1e2a] hover:border-[#272b3d] rounded-2xl overflow-hidden transition-all duration-200 group shadow-md hover:shadow-xl">
			{/* Top Image Banner */}
			<div className="relative w-full h-40 bg-[#12141e] overflow-hidden">
				<img
					src={image}
					alt={name}
					className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
				/>
				{/* Category Badge overlay */}
				<div className="absolute top-3 right-3">
					<span
						className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border backdrop-blur-md ${getCategoryBadgeColor(
							category
						)}`}>
						{category}
					</span>
				</div>
			</div>

			{/* Card Body */}
			<div className="p-5 flex flex-col flex-1 justify-between gap-4">
				<div className="flex flex-col gap-3">
					{/* Icon & Title Row */}
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-[#141622] border border-[#202334] flex items-center justify-center shrink-0 text-[#a78bfa]">
							{icon}
						</div>
						<div className="flex flex-col min-w-0">
							<h3 className="text-sm font-bold text-white tracking-tight truncate">
								{name}
							</h3>
							<span className="text-xs text-[#71748d]">{members}</span>
						</div>
					</div>

					{/* Description */}
					<p className="text-xs text-[#9d9fb5] leading-relaxed line-clamp-2">
						{description}
					</p>
				</div>

				{/* Join Button */}
				<button
					type="button"
					onClick={() => onToggleJoin(id)}
					className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
						isJoined
							? "bg-[#131520] hover:bg-[#1a1d2d] text-white border border-[#23263a]"
							: "bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-md shadow-purple-900/30 active:scale-[0.99]"
					}`}>
					{isJoined ? "Joined ✓" : "Join Community"}
				</button>
			</div>
		</div>
	);
};

export default CommunityCard;
