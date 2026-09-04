import React from "react";

const Header = ({ title = "Home", subtitle = "What's happening on campus", user = { name: "Alex Chen", avatar: "A" } }) => {
	return (
		<header className="w-full bg-[#07080b]/90 backdrop-blur-md sticky top-0 z-20 py-4 px-6 sm:px-8 border-b border-[#141620] flex items-center justify-between gap-4">
			{/* Title & Subtitle */}
			<div>
				<h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
					{title}
				</h1>
				<p className="text-xs text-[#8b8da4] mt-0.5">{subtitle}</p>
			</div>

			{/* Search & Actions */}
			<div className="flex items-center gap-3.5">
				{/* Search Bar */}
				<div className="relative hidden sm:block">
					<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#52556d]">
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<input
						type="text"
						placeholder="Search..."
						className="bg-[#12141e] border border-[#1e202d] focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-[#50536c] outline-none w-56 md:w-72 transition-all duration-150"
					/>
				</div>

				{/* Notification Bell */}
				<button
					type="button"
					className="relative p-2.5 rounded-xl bg-[#12141e] hover:bg-[#1a1c2a] border border-[#1e202d] text-[#8b8da4] hover:text-white transition-colors cursor-pointer">
					<svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
					</svg>
					<span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#07080b]">
						3
					</span>
				</button>

				{/* User Avatar */}
				<button
					type="button"
					className="w-9 h-9 rounded-full bg-[#06b6d4] text-white font-bold flex items-center justify-center text-sm shadow-md hover:ring-2 hover:ring-[#06b6d4]/50 transition-all cursor-pointer select-none">
					{user.avatar || "A"}
				</button>
			</div>
		</header>
	);
};

export default Header;
