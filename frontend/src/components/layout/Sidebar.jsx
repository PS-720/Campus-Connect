import React from "react";
import BrandLogo from "../common/BrandLogo";

const Sidebar = ({ activeTab = "Home", onSelectTab }) => {
	const handleTabClick = (tabName) => {
		if (onSelectTab) onSelectTab(tabName);
	};

	const active = activeTab;

	const mainNavItems = [
		{
			id: "Home",
			label: "Home",
			icon: (
				<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
				</svg>
			),
		},
		{
			id: "Communities",
			label: "Communities",
			icon: (
				<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
			),
		},
		{
			id: "Notes",
			label: "Notes",
			icon: (
				<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
				</svg>
			),
		},
		{
			id: "Events",
			label: "Events",
			icon: (
				<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			),
		},
		{
			id: "Messages",
			label: "Messages",
			badge: 3,
			icon: (
				<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
				</svg>
			),
		},
	];

	const aiToolItems = [
		{
			id: "AI Study",
			label: "AI Study",
			icon: (
				<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
				</svg>
			),
		},
		{
			id: "AI Summarizer",
			label: "AI Summarizer",
			icon: (
				<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
			),
		},
		{
			id: "AI Quiz",
			label: "AI Quiz",
			icon: (
				<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
				</svg>
			),
		},
	];

	const bottomNavItems = [
		{
			id: "Notifications",
			label: "Notifications",
			badge: 3,
			icon: (
				<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
				</svg>
			),
		},
		{
			id: "Profile",
			label: "Profile",
			icon: (
				<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
			),
		},
		{
			id: "Settings",
			label: "Settings",
			icon: (
				<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
			),
		},
	];

	return (
		<aside className="w-60 h-screen sticky top-0 bg-[#0a0b0f] border-r border-[#151722] flex flex-col justify-between py-5 px-3 select-none shrink-0 z-30">
			{/* Top: Logo & Main Navigation */}
			<div className="flex flex-col gap-6">
				{/* Logo */}
				<div className="px-3 pt-1">
					<BrandLogo />
				</div>

				{/* Main Nav Links */}
				<nav className="flex flex-col gap-1">
					{mainNavItems.map((item) => {
						const isActive = active === item.id;
						return (
							<button
								key={item.id}
								onClick={() => handleTabClick(item.id)}
								className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
									isActive
										? "bg-[#20153d] text-[#c4b5fd] shadow-sm shadow-purple-950/40 font-semibold"
										: "text-[#8b8da4] hover:text-white hover:bg-[#12141e]"
								}`}>
								<div className="flex items-center gap-3">
									<span className={isActive ? "text-[#a78bfa]" : "text-[#71748d]"}>
										{item.icon}
									</span>
									<span>{item.label}</span>
								</div>

								{item.badge && (
									<span className="w-5 h-5 rounded-full bg-[#ef4444] text-white text-[11px] font-bold flex items-center justify-center shadow-sm shadow-red-900/50">
										{item.badge}
									</span>
								)}
							</button>
						);
					})}
				</nav>

				{/* AI Tools Section */}
				<div className="flex flex-col gap-1">
					<span className="text-[11px] font-bold tracking-wider text-[#4a4d65] uppercase px-3.5 mb-1">
						AI Tools
					</span>
					{aiToolItems.map((item) => {
						const isActive = active === item.id;
						return (
							<button
								key={item.id}
								onClick={() => handleTabClick(item.id)}
								className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
									isActive
										? "bg-[#20153d] text-[#c4b5fd] shadow-sm shadow-purple-950/40 font-semibold"
										: "text-[#8b8da4] hover:text-white hover:bg-[#12141e]"
								}`}>
								<div className="flex items-center gap-3">
									<span className={isActive ? "text-[#a78bfa]" : "text-[#71748d]"}>
										{item.icon}
									</span>
									<span>{item.label}</span>
								</div>

								<span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#241747] text-[#a78bfa] border border-[#3b2b68]">
									AI
								</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Bottom: Settings & Profile */}
			<div className="flex flex-col gap-1 pt-4 border-t border-[#141620]">
				{bottomNavItems.map((item) => {
					const isActive = active === item.id;
					return (
						<button
							key={item.id}
							onClick={() => handleTabClick(item.id)}
							className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
								isActive
									? "bg-[#20153d] text-[#c4b5fd] font-semibold"
									: "text-[#8b8da4] hover:text-white hover:bg-[#12141e]"
							}`}>
							<div className="flex items-center gap-3">
								<span className={isActive ? "text-[#a78bfa]" : "text-[#71748d]"}>
									{item.icon}
								</span>
								<span>{item.label}</span>
							</div>

							{item.badge && (
								<span className="w-5 h-5 rounded-full bg-[#ef4444] text-white text-[11px] font-bold flex items-center justify-center shadow-sm shadow-red-900/50">
									{item.badge}
								</span>
							)}
						</button>
					);
				})}
			</div>
		</aside>
	);
};

export default Sidebar;
