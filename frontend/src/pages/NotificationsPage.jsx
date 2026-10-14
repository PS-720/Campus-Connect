import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const INITIAL_NOTIFICATIONS = [
	{
		id: 1,
		actor: "Priya Sharma",
		action: "liked your post about the hackathon win",
		time: "2m ago",
		isUnread: true,
		type: "like",
		icon: (
			<svg className="w-4.5 h-4.5 text-[#f43f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.8}
					d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
				/>
			</svg>
		),
		iconBg: "bg-[#25141c]",
		iconBorder: "border-[#451929]",
	},
	{
		id: 2,
		actor: "Dev Patel",
		action: 'commented: "Congrats! Our team should collaborate next time!"',
		time: "15m ago",
		isUnread: true,
		type: "comment",
		icon: (
			<svg className="w-4.5 h-4.5 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.8}
					d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
				/>
			</svg>
		),
		iconBg: "bg-[#1c1630]",
		iconBorder: "border-[#332258]",
	},
	{
		id: 3,
		actor: "Coding Club",
		action: "You've been added as a moderator",
		time: "1h ago",
		isUnread: true,
		type: "community",
		icon: (
			<svg className="w-4.5 h-4.5 text-[#38bdf8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.8}
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
		),
		iconBg: "bg-[#102230]",
		iconBorder: "border-[#1b3d57]",
	},
	{
		id: 4,
		actor: "CampusConnect AI",
		action: "Your DSA quiz result is ready. Score: 85%",
		time: "2h ago",
		isUnread: false,
		type: "ai",
		icon: (
			<svg className="w-4.5 h-4.5 text-[#c4b5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.8}
					d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
				/>
			</svg>
		),
		iconBg: "bg-[#181926]",
		iconBorder: "border-[#2b2d42]",
	},
	{
		id: 5,
		actor: "HackMIT 2025",
		action: "Reminder: Event starts in 3 days. You're registered.",
		time: "3h ago",
		isUnread: false,
		type: "event",
		icon: (
			<svg className="w-4.5 h-4.5 text-[#fb923c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.8}
					d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
		),
		iconBg: "bg-[#251a14]",
		iconBorder: "border-[#4a2e1d]",
	},
	{
		id: 6,
		actor: "Sara Liu",
		action: "downloaded your Machine Learning notes",
		time: "5h ago",
		isUnread: false,
		type: "note",
		icon: (
			<svg className="w-4.5 h-4.5 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.8}
					d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
				/>
			</svg>
		),
		iconBg: "bg-[#10241e]",
		iconBorder: "border-[#1b4337]",
	},
	{
		id: 7,
		actor: "Marcus Johnson",
		action: "rated your DSA notes 5 stars",
		time: "6h ago",
		isUnread: false,
		type: "rating",
		icon: (
			<svg className="w-4.5 h-4.5 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.8}
					d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
				/>
			</svg>
		),
		iconBg: "bg-[#251e12]",
		iconBorder: "border-[#483719]",
	},
];

const NotificationsPage = ({ onNavigateTab }) => {
	const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

	const unreadCount = notifications.filter((n) => n.isUnread).length;

	const handleMarkAllRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
	};

	const handleToggleNotification = (id) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, isUnread: !n.isUnread } : n))
		);
	};

	return (
		<div className="min-h-screen bg-[#07080b] text-white flex">
			{/* Left Main Navigation Sidebar */}
			<Sidebar activeTab="Notifications" onSelectTab={onNavigateTab} />

			{/* Main Scrollable Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Top Header */}
				<Header
					title="Notifications"
					subtitle=""
					user={{ name: "Alex Chen", avatar: "A" }}
				/>

				{/* Page Content */}
				<main className="flex-1 px-6 sm:px-8 py-8 flex flex-col items-center">
					<div className="w-full max-w-3xl flex flex-col gap-4">
						{/* Top Sub-bar: Unread Count + Mark All Read */}
						<div className="flex items-center justify-between px-1">
							<span className="text-xs font-semibold text-[#8b8da4]">
								{unreadCount} unread
							</span>

							{unreadCount > 0 && (
								<button
									type="button"
									onClick={handleMarkAllRead}
									className="text-xs font-medium text-[#8b5cf6] hover:text-[#a78bfa] transition-colors cursor-pointer">
									Mark all read
								</button>
							)}
						</div>

						{/* Notifications List */}
						<div className="flex flex-col gap-2.5">
							{notifications.map((item) => (
								<div
									key={item.id}
									onClick={() => handleToggleNotification(item.id)}
									className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-150 cursor-pointer ${
										item.isUnread
											? "bg-[#0d0f17] border-[#222538] hover:border-[#32364f]"
											: "bg-[#0a0b0f] border-[#161824] hover:border-[#222538] opacity-85 hover:opacity-100"
									}`}>
									{/* Left: Icon Box + Actor Text + Time */}
									<div className="flex items-center gap-3.5 min-w-0 flex-1 pr-4">
										{/* Icon */}
										<div
											className={`w-10 h-10 rounded-xl ${item.iconBg} border ${item.iconBorder} flex items-center justify-center shrink-0 shadow-sm`}>
											{item.icon}
										</div>

										{/* Content */}
										<div className="flex flex-col min-w-0">
											<p className="text-xs sm:text-sm text-[#d4d6e2] leading-snug truncate">
												<strong className="text-white font-semibold">
													{item.actor}
												</strong>{" "}
												<span className="text-[#9d9fb5]">{item.action}</span>
											</p>
											<span className="text-[11px] text-[#71748d] mt-0.5">
												{item.time}
											</span>
										</div>
									</div>

									{/* Right: Purple Dot for unread */}
									{item.isUnread && (
										<div className="w-2 h-2 rounded-full bg-[#8b5cf6] shrink-0 shadow-sm shadow-purple-500/50" />
									)}
								</div>
							))}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default NotificationsPage;
