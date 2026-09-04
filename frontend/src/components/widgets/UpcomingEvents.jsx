import React from "react";

const EVENTS = [
	{
		id: 1,
		title: "HackMIT 2025",
		category: "Hackathon",
		categoryColor: "bg-[#241747] text-[#a78bfa] border-[#3b2b68]",
		date: "Sep 12",
		icon: (
			<svg className="w-5 h-5 text-[#8b8da4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
			</svg>
		),
	},
	{
		id: 2,
		title: "AI Workshop Series",
		category: "Workshop",
		categoryColor: "bg-[#332214] text-[#fb923c] border-[#57351a]",
		date: "Sep 15",
		icon: (
			<svg className="w-5 h-5 text-[#8b8da4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
			</svg>
		),
	},
	{
		id: 3,
		title: "Career Fair",
		category: "Career",
		categoryColor: "bg-[#112a1f] text-[#4ade80] border-[#1a5338]",
		date: "Sep 18",
		icon: (
			<svg className="w-5 h-5 text-[#8b8da4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
			</svg>
		),
	},
];

const UpcomingEvents = ({ onSeeAll }) => {
	return (
		<div className="flex flex-col gap-3">
			{/* Widget Header */}
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-bold text-white tracking-tight">
					Upcoming Events
				</h3>
				<button
					type="button"
					onClick={onSeeAll}
					className="text-xs font-medium text-[#8b5cf6] hover:text-[#a78bfa] transition-colors cursor-pointer">
					See all
				</button>
			</div>

			{/* Event Items */}
			<div className="flex flex-col gap-2.5">
				{EVENTS.map((event) => (
					<div
						key={event.id}
						className="flex items-center gap-3.5 p-3 rounded-xl bg-[#0d0f15] border border-[#1b1e2a] hover:border-[#272b3c] transition-all cursor-pointer">
						{/* Icon Box */}
						<div className="w-10 h-10 rounded-xl bg-[#141620] border border-[#1f2231] flex items-center justify-center shrink-0">
							{event.icon}
						</div>

						{/* Details */}
						<div className="flex flex-col gap-1 min-w-0 flex-1">
							<span className="text-xs font-semibold text-white truncate">
								{event.title}
							</span>
							<div className="flex items-center gap-2">
								<span
									className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${event.categoryColor}`}>
									{event.category}
								</span>
								<span className="text-[11px] text-[#71748d]">{event.date}</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default UpcomingEvents;
