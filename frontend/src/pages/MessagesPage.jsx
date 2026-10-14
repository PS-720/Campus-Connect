import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import ConversationItem from "../components/messages/ConversationItem";
import ChatView from "../components/messages/ChatView";

const INITIAL_CONVERSATIONS = [
	{
		id: 1,
		name: "Priya Sharma",
		lastMessage: "Did you see the hackatho...",
		time: "2m",
		unreadCount: 2,
		avatarText: "P",
		avatarBg: "bg-[#10b981]",
		isOnline: true,
		subtitle: "Computer Science · 3rd Year",
		messages: [
			{
				id: 101,
				text: "Hey Alex! How is the project going?",
				time: "10:14 AM",
				isMe: false,
			},
			{
				id: 102,
				text: "Going great, just finishing up the events page!",
				time: "10:15 AM",
				isMe: true,
			},
			{
				id: 103,
				text: "Did you see the hackathon announcement for next week?",
				time: "10:16 AM",
				isMe: false,
			},
		],
	},
	{
		id: 2,
		name: "Coding Club",
		lastMessage: "Meeting tomorrow at 5 PM...",
		time: "15m",
		unreadCount: 5,
		avatarText: "C",
		avatarBg: "bg-[#f97316]",
		isOnline: true,
		subtitle: "1,247 members",
		messages: [
			{
				id: 201,
				text: "Reminder: Weekly open-source workshop is scheduled.",
				time: "9:30 AM",
				isMe: false,
			},
			{
				id: 202,
				text: "Meeting tomorrow at 5 PM in Room 304!",
				time: "9:45 AM",
				isMe: false,
			},
		],
	},
	{
		id: 3,
		name: "Dev Patel",
		lastMessage: "Thanks for the notes!",
		time: "1h",
		unreadCount: 0,
		avatarText: "D",
		avatarBg: "bg-[#10b981]",
		isOnline: false,
		subtitle: "Computer Science · 5th Sem",
		messages: [
			{
				id: 301,
				text: "Hey, can you share your algorithms guide?",
				time: "Yesterday",
				isMe: false,
			},
			{
				id: 302,
				text: "Sure thing, just uploaded it to the Notes section!",
				time: "Yesterday",
				isMe: true,
			},
			{
				id: 303,
				text: "Thanks for the notes!",
				time: "1h ago",
				isMe: false,
			},
		],
	},
	{
		id: 4,
		name: "AI & Robotics Study Group",
		lastMessage: "Marcus: Check out this paper o...",
		time: "2h",
		unreadCount: 0,
		avatarText: "A",
		avatarBg: "bg-[#06b6d4]",
		isOnline: true,
		subtitle: "856 members",
		messages: [
			{
				id: 401,
				text: "Marcus: Check out this paper on vision-language models for robot control!",
				time: "2h ago",
				isMe: false,
			},
		],
	},
	{
		id: 5,
		name: "Sara Liu",
		lastMessage: "Are you free for the study ...",
		time: "3h",
		unreadCount: 1,
		avatarText: "S",
		avatarBg: "bg-[#06b6d4]",
		isOnline: true,
		subtitle: "Computer Science · 6th Sem",
		messages: [
			{
				id: 501,
				text: "Are you free for the study session before the exam?",
				time: "3h ago",
				isMe: false,
			},
		],
	},
	{
		id: 6,
		name: "Marcus Johnson",
		lastMessage: "The PR is ready for review",
		time: "5h",
		unreadCount: 0,
		avatarText: "M",
		avatarBg: "bg-[#06b6d4]",
		isOnline: false,
		subtitle: "Electrical Eng. · 2nd Year",
		messages: [
			{
				id: 601,
				text: "The PR is ready for review whenever you have a chance.",
				time: "5h ago",
				isMe: false,
			},
		],
	},
];

const MessagesPage = ({ onNavigateTab }) => {
	const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
	const [selectedId, setSelectedId] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	const selectedConversation = conversations.find((c) => c.id === selectedId);

	const handleSelectConversation = (id) => {
		setSelectedId(id);
		// Clear unread count on open
		setConversations((prev) =>
			prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
		);
	};

	const handleSendMessage = (conversationId, text) => {
		const newMsg = {
			id: Date.now(),
			text,
			time: "Just now",
			isMe: true,
		};

		setConversations((prev) =>
			prev.map((c) =>
				c.id === conversationId
					? {
							...c,
							lastMessage: text,
							time: "Just now",
							messages: [...(c.messages || []), newMsg],
					  }
					: c
			)
		);
	};

	const filteredConversations = conversations.filter(
		(c) =>
			c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="h-screen bg-[#07080b] text-white flex overflow-hidden">
			{/* Left Main Navigation Sidebar */}
			<Sidebar activeTab="Messages" onSelectTab={onNavigateTab} />

			{/* Messages Master-Detail Layout */}
			<div className="flex-1 flex overflow-hidden">
				{/* Conversations Left Panel */}
				<aside
					className={`w-full md:w-80 lg:w-96 h-full bg-[#0a0b0f] border-r border-[#151722] flex flex-col shrink-0 ${
						selectedId ? "hidden md:flex" : "flex"
					}`}>
					{/* Header */}
					<div className="p-5 pb-3">
						<h1 className="text-xl font-bold text-white tracking-tight mb-4">
							Messages
						</h1>

						{/* Search Input */}
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#52556d]">
								<svg
									className="w-4 h-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search conversations..."
								className="w-full bg-[#12141e] border border-[#1e202d] focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#50536c] outline-none transition-colors"
							/>
						</div>
					</div>

					{/* Conversations List */}
					<div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1">
						{filteredConversations.map((conv) => (
							<ConversationItem
								key={conv.id}
								conversation={conv}
								isSelected={selectedId === conv.id}
								onClick={() => handleSelectConversation(conv.id)}
							/>
						))}
					</div>
				</aside>

				{/* Right Detail Pane */}
				<div
					className={`flex-1 flex flex-col h-full ${
						selectedId ? "flex" : "hidden md:flex"
					}`}>
					{selectedConversation ? (
						<ChatView
							conversation={selectedConversation}
							onSendMessage={handleSendMessage}
							onBack={() => setSelectedId(null)}
						/>
					) : (
						/* Empty State (Matching screenshot exactly) */
						<div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#07080b]">
							{/* Chat Icon Container */}
							<div className="w-14 h-14 rounded-2xl bg-[#141622] border border-[#202334] flex items-center justify-center text-[#8b8da4] mb-5 shadow-lg shadow-black/40">
								<svg
									className="w-6 h-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.8}
										d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
									/>
								</svg>
							</div>

							{/* Empty State Heading & Subtitle */}
							<h3 className="text-base font-bold text-white tracking-tight mb-1.5">
								Select a conversation
							</h3>
							<p className="text-xs text-[#71748d] max-w-xs mb-6">
								Choose from your messages to start chatting
							</p>

							{/* New Message CTA */}
							<button
								type="button"
								onClick={() => handleSelectConversation(1)}
								className="px-5 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold shadow-lg shadow-purple-900/30 flex items-center gap-2 transition-all active:scale-[0.99] cursor-pointer">
								<svg
									className="w-4 h-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
								<span>New Message</span>
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default MessagesPage;
