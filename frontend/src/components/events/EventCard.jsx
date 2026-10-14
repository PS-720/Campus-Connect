import React from "react";

const CATEGORY_COLORS = {
	hackathon: {
		bg: "bg-[#241747]/90",
		text: "text-[#c4b5fd]",
		border: "border-[#3e2b70]",
	},
	workshop: {
		bg: "bg-[#382313]/90",
		text: "text-[#fb923c]",
		border: "border-[#5a361c]",
	},
	career: {
		bg: "bg-[#122e1e]/90",
		text: "text-[#4ade80]",
		border: "border-[#1d5939]",
	},
	cultural: {
		bg: "bg-[#3d2414]/90",
		text: "text-[#f97316]",
		border: "border-[#5c371d]",
	},
	sports: {
		bg: "bg-[#382012]/90",
		text: "text-[#f59e0b]",
		border: "border-[#553018]",
	},
};

const EventCard = ({ event, onToggleRegister }) => {
	const {
		id,
		title,
		category,
		date,
		time,
		location,
		attendeesCount,
		isRegistered,
		image,
	} = event;

	const catStyle = CATEGORY_COLORS[category.toLowerCase()] || {
		bg: "bg-[#181926]/90",
		text: "text-[#a78bfa]",
		border: "border-[#292b40]",
	};

	return (
		<div className="flex flex-col bg-[#0d0f15] border border-[#1b1e2a] hover:border-[#272b3d] rounded-2xl overflow-hidden transition-all duration-200 group shadow-md hover:shadow-xl">
			{/* Top Image Banner */}
			<div className="relative w-full h-44 bg-[#12141e] overflow-hidden">
				<img
					src={image}
					alt={title}
					className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
				/>

				{/* Category Badge overlay on top-left */}
				<div className="absolute top-3 left-3">
					<span
						className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border backdrop-blur-md ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
						{category}
					</span>
				</div>

				{/* Registered status indicator on top-right if registered */}
				{isRegistered && (
					<div className="absolute top-3 right-3">
						<span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#122e1e]/90 text-[#4ade80] border border-[#1d5939] backdrop-blur-md flex items-center gap-1">
							Registered
						</span>
					</div>
				)}
			</div>

			{/* Card Body */}
			<div className="p-5 flex flex-col flex-1 justify-between gap-5">
				<div className="flex flex-col gap-3">
					{/* Title */}
					<h3 className="text-base font-bold text-white tracking-tight leading-snug line-clamp-1 group-hover:text-[#c4b5fd] transition-colors">
						{title}
					</h3>

					{/* Date, Time, Location */}
					<div className="flex flex-col gap-1.5 text-xs text-[#8b8da4]">
						{/* Date */}
						<div className="flex items-center gap-2">
							<svg
								className="w-3.5 h-3.5 text-[#71748d] shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.8}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							<span>{date}</span>
						</div>

						{/* Time */}
						<div className="flex items-center gap-2">
							<svg
								className="w-3.5 h-3.5 text-[#71748d] shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.8}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>{time}</span>
						</div>

						{/* Location */}
						<div className="flex items-center gap-2">
							<svg
								className="w-3.5 h-3.5 text-[#71748d] shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.8}
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.8}
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							<span className="truncate">{location}</span>
						</div>
					</div>
				</div>

				{/* Bottom Action Row: Attendees + Register/Registered button */}
				<div className="flex items-center justify-between gap-3 pt-3 border-t border-[#181a26]">
					{/* Stacked Avatars + Going count */}
					<div className="flex items-center gap-2">
						<div className="flex -space-x-1.5 overflow-hidden">
							<span className="inline-flex items-center justify-center w-5 h-5 rounded-full ring-2 ring-[#0d0f15] bg-[#06b6d4] text-[9px] font-bold text-white select-none">
								A
							</span>
							<span className="inline-flex items-center justify-center w-5 h-5 rounded-full ring-2 ring-[#0d0f15] bg-[#8b5cf6] text-[9px] font-bold text-white select-none">
								B
							</span>
							<span className="inline-flex items-center justify-center w-5 h-5 rounded-full ring-2 ring-[#0d0f15] bg-[#f97316] text-[9px] font-bold text-white select-none">
								C
							</span>
						</div>
						<span className="text-xs text-[#71748d]">
							+{attendeesCount} going
						</span>
					</div>

					{/* Register Button */}
					<button
						type="button"
						onClick={() => onToggleRegister(id)}
						className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 ${
							isRegistered
								? "bg-[#141622] hover:bg-[#1a1d2d] text-white border border-[#23263a]"
								: "bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-md shadow-purple-900/30 active:scale-[0.99]"
						}`}>
						{isRegistered ? "Registered ✓" : "Register"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default EventCard;
