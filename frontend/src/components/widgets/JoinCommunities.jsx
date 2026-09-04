import React, { useState } from "react";

const INITIAL_COMMUNITIES = [
	{
		id: 1,
		name: "Coding Club",
		members: "1.2k members",
		icon: (
			<svg className="w-5 h-5 text-[#8b8da4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
			</svg>
		),
	},
	{
		id: 2,
		name: "AI & Robotics",
		members: "856 members",
		icon: (
			<svg className="w-5 h-5 text-[#8b8da4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
			</svg>
		),
	},
	{
		id: 3,
		name: "Photography Club",
		members: "642 members",
		icon: (
			<svg className="w-5 h-5 text-[#8b8da4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
			</svg>
		),
	},
];

const JoinCommunities = ({ onBrowse }) => {
	const [joinedList, setJoinedList] = useState([]);

	const toggleJoin = (id) => {
		setJoinedList((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
		);
	};

	return (
		<div className="flex flex-col gap-3">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-bold text-white tracking-tight">
					Join Communities
				</h3>
				<button
					type="button"
					onClick={onBrowse}
					className="text-xs font-medium text-[#8b5cf6] hover:text-[#a78bfa] transition-colors cursor-pointer">
					Browse
				</button>
			</div>

			{/* List */}
			<div className="flex flex-col gap-2.5">
				{INITIAL_COMMUNITIES.map((community) => {
					const isJoined = joinedList.includes(community.id);
					return (
						<div
							key={community.id}
							className="flex items-center justify-between p-3 rounded-xl bg-[#0d0f15] border border-[#1b1e2a] hover:border-[#272b3c] transition-all">
							<div className="flex items-center gap-3.5 min-w-0">
								{/* Icon */}
								<div className="w-10 h-10 rounded-xl bg-[#141620] border border-[#1f2231] flex items-center justify-center shrink-0">
									{community.icon}
								</div>

								{/* Details */}
								<div className="flex flex-col min-w-0">
									<span className="text-xs font-semibold text-white truncate">
										{community.name}
									</span>
									<span className="text-[11px] text-[#71748d]">
										{community.members}
									</span>
								</div>
							</div>

							{/* Join Button */}
							<button
								type="button"
								onClick={() => toggleJoin(community.id)}
								className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
									isJoined
										? "bg-[#1f2130] text-[#a78bfa] border border-[#303348]"
										: "bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-sm shadow-purple-900/40"
								}`}>
								{isJoined ? "Joined" : "Join"}
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default JoinCommunities;
