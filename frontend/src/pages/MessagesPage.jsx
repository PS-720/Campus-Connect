import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import ConversationItem from "../components/messages/ConversationItem";
import ChatView from "../components/messages/ChatView";
import { getConversations, sendMessage, markConversationRead } from "../services/messageService";

const MessagesPage = ({ onNavigateTab }) => {
	const [conversations, setConversations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedId, setSelectedId] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	const fetchConversations = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getConversations();
			const list = Array.isArray(data) ? data : [];
			setConversations(list);
			if (list.length > 0 && !selectedId) {
				setSelectedId(list[0].id);
			}
		} catch (err) {
			console.error("Failed to load conversations:", err);
			setError(err.message || "Failed to load conversations");
		} finally {
			setLoading(false);
		}
	}, [selectedId]);

	useEffect(() => {
		fetchConversations();
	}, [fetchConversations]);

	const selectedConversation = conversations.find((c) => c.id === selectedId);

	const handleSelectConversation = async (id) => {
		setSelectedId(id);
		// Clear unread count on open
		setConversations((prev) =>
			prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
		);
		try {
			await markConversationRead(id);
		} catch (err) {
			console.error("Failed to mark conversation read:", err);
		}
	};

	const handleSendMessage = async (conversationId, text) => {
		const tempId = "temp_" + Date.now();
		const optimisticMsg = {
			id: tempId,
			text,
			time: "Just now",
			isMe: true,
		};

		// Optimistic update
		setConversations((prev) =>
			prev.map((c) =>
				c.id === conversationId
					? {
							...c,
							lastMessage: text,
							time: "Just now",
							messages: [...(c.messages || []), optimisticMsg],
					  }
					: c
			)
		);

		try {
			const saved = await sendMessage(conversationId, text);
			if (saved && saved.id) {
				setConversations((prev) =>
					prev.map((c) =>
						c.id === conversationId
							? {
									...c,
									messages: (c.messages || []).map((m) =>
										m.id === tempId ? { ...m, id: saved.id, time: saved.time } : m
									),
							  }
							: c
					)
				);
			}
		} catch (err) {
			console.error("Failed to send message:", err);
		}
	};

	const filteredConversations = conversations.filter(
		(c) =>
			(c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
			(c.lastMessage || "").toLowerCase().includes(searchQuery.toLowerCase())
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
								placeholder="Search chats, students..."
								className="w-full bg-[#12141e] border border-[#1e2130] focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#50536c] outline-none transition-colors"
							/>
						</div>
					</div>

					{/* Error alert */}
					{error && (
						<div className="mx-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center justify-between">
							<span>{error}</span>
							<button onClick={fetchConversations} className="text-red-300 underline font-semibold">
								Retry
							</button>
						</div>
					)}

					{/* Conversations List */}
					<div className="flex-1 overflow-y-auto px-2 space-y-1">
						{loading ? (
							<div className="p-3 space-y-3">
								{[1, 2, 3, 4, 5].map((n) => (
									<div key={n} className="flex items-center gap-3 p-3 rounded-xl animate-pulse bg-[#12141e]/50">
										<div className="w-10 h-10 rounded-full bg-[#1b1e2e] shrink-0" />
										<div className="flex-1 space-y-2">
											<div className="h-3 bg-[#1b1e2e] rounded w-1/2" />
											<div className="h-2.5 bg-[#1b1e2e] rounded w-3/4" />
										</div>
									</div>
								))}
							</div>
						) : filteredConversations.length > 0 ? (
							filteredConversations.map((conv) => (
								<ConversationItem
									key={conv.id}
									conversation={conv}
									isSelected={conv.id === selectedId}
									onClick={() => handleSelectConversation(conv.id)}
								/>
							))
						) : (
							<div className="p-6 text-center text-[#71748d] text-xs">
								No conversations found
							</div>
						)}
					</div>
				</aside>

				{/* Right Main Chat View */}
				<main
					className={`flex-1 flex flex-col h-full bg-[#07080b] ${
						!selectedId ? "hidden md:flex" : "flex"
					}`}>
					{selectedConversation ? (
						<ChatView
							conversation={selectedConversation}
							onSendMessage={handleSendMessage}
							onBack={() => setSelectedId(null)}
						/>
					) : (
						<div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#71748d]">
							<div className="w-16 h-16 rounded-2xl bg-[#12141e] border border-[#202334] flex items-center justify-center text-[#a78bfa] mb-4">
								<svg
									className="w-8 h-8"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
									/>
								</svg>
							</div>
							<h3 className="text-base font-semibold text-white mb-1">
								Select a conversation
							</h3>
							<p className="text-xs max-w-sm">
								Choose a classmate or club group from the left panel to start messaging in real-time.
							</p>
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default MessagesPage;
