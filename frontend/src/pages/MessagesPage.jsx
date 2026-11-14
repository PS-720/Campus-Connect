import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import ConversationItem from "../components/messages/ConversationItem";
import ChatView from "../components/messages/ChatView";
import { getConversations, sendMessage, markConversationRead, startConversation } from "../services/messageService";
import { searchUsers } from "../services/userService";

const MessagesPage = ({ onNavigateTab }) => {
	const [conversations, setConversations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedId, setSelectedId] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	// New Chat Modal state
	const [showNewChatModal, setShowNewChatModal] = useState(false);
	const [studentSearch, setStudentSearch] = useState("");
	const [students, setStudents] = useState([]);
	const [studentsLoading, setStudentsLoading] = useState(false);
	const [startingChat, setStartingChat] = useState(false);

	// Fetch conversations (with silent mode for background polling)
	const fetchConversations = useCallback(async (silent = false) => {
		try {
			if (!silent) {
				setLoading(true);
				setError(null);
			}
			const data = await getConversations();
			const list = Array.isArray(data) ? data : [];
			setConversations(list);

			// Auto-select first conversation only on initial load if none selected
			setSelectedId((prev) => {
				if (!prev && list.length > 0) return list[0].id;
				return prev;
			});
		} catch (err) {
			console.error("Failed to load conversations:", err);
			if (!silent) {
				setError(err.message || "Failed to load conversations");
			}
		} finally {
			if (!silent) {
				setLoading(false);
			}
		}
	}, []);

	// Initial load and periodic polling every 3 seconds for real-time messages
	useEffect(() => {
		fetchConversations(false);
		const interval = setInterval(() => {
			fetchConversations(true);
		}, 3000);
		return () => clearInterval(interval);
	}, [fetchConversations]);

	// Load students when opening New Chat modal
	useEffect(() => {
		if (showNewChatModal) {
			let active = true;
			setStudentsLoading(true);
			searchUsers(studentSearch)
				.then((users) => {
					if (active) {
						const list = Array.isArray(users)
							? users
							: Array.isArray(users?.data)
							? users.data
							: [];
						setStudents(list);
					}
				})
				.catch((err) => {
					console.error("Failed to search students:", err);
					if (active) setStudents([]);
				})
				.finally(() => {
					if (active) setStudentsLoading(false);
				});

			return () => {
				active = false;
			};
		}
	}, [showNewChatModal, studentSearch]);

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

	// Start a direct chat with a student
	const handleStartChatWithStudent = async (student) => {
		setStartingChat(true);
		try {
			const targetId = student?.id || student?._id;
			if (!targetId) {
				console.error("No student ID found for", student);
				setShowNewChatModal(false);
				return;
			}

			// Check if conversation already exists locally with this student
			const existing = conversations.find(
				(c) =>
					c.participantId === targetId ||
					(c.name && c.name.toLowerCase() === (student.name || "").toLowerCase())
			);

			if (existing) {
				setSelectedId(existing.id);
				setShowNewChatModal(false);
				return;
			}

			// Call backend to get or create the conversation
			const conv = await startConversation(targetId);
			const convData = conv?.data || conv;

			if (convData && convData.id) {
				setConversations((prev) => {
					const exists = prev.some((c) => c.id === convData.id);
					return exists ? prev : [convData, ...prev];
				});
				setSelectedId(convData.id);
			} else {
				const fresh = await getConversations();
				const list = Array.isArray(fresh) ? fresh : (fresh?.data || []);
				setConversations(list);
				if (list.length > 0) setSelectedId(list[0].id);
			}

			setShowNewChatModal(false);
		} catch (err) {
			console.error("Failed to start chat with student:", err);
			// Fallback: still close modal and select if any conversation exists
			setShowNewChatModal(false);
		} finally {
			setStartingChat(false);
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
						<div className="flex items-center justify-between mb-4">
							<h1 className="text-xl font-bold text-white tracking-tight">
								Messages
							</h1>
							<button
								type="button"
								onClick={() => setShowNewChatModal(true)}
								className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer">
								<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
								</svg>
								<span>New Chat</span>
							</button>
						</div>

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
							<button onClick={() => fetchConversations(false)} className="text-red-300 underline font-semibold cursor-pointer">
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
							<p className="text-xs max-w-sm mb-4">
								Choose a classmate or club group from the left panel to start messaging in real-time.
							</p>
							<button
								type="button"
								onClick={() => setShowNewChatModal(true)}
								className="px-4 py-2 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold transition-all cursor-pointer">
								Start New Conversation
							</button>
						</div>
					)}
				</main>
			</div>

			{/* New Chat Modal */}
			{showNewChatModal && (
				<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
					<div className="w-full max-w-md bg-[#0e1017] border border-[#232638] rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
						<div className="flex items-center justify-between pb-4 border-b border-[#1b1e2c]">
							<div>
								<h2 className="text-base font-bold text-white">Start New Conversation</h2>
								<p className="text-xs text-[#71748d]">Find and message a classmate on campus</p>
							</div>
							<button
								type="button"
								onClick={() => setShowNewChatModal(false)}
								className="w-8 h-8 rounded-full bg-[#181a26] text-[#8b8da4] hover:text-white flex items-center justify-center cursor-pointer transition-colors">
								✕
							</button>
						</div>

						{/* Search box */}
						<div className="mt-4 relative">
							<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#52556d]">
								<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
							</div>
							<input
								type="text"
								value={studentSearch}
								onChange={(e) => setStudentSearch(e.target.value)}
								placeholder="Search students by name or department..."
								className="w-full bg-[#151722] border border-[#25283a] focus:border-[#7c3aed] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#50536c] outline-none"
								autoFocus
							/>
						</div>

						{/* Students list */}
						<div className="mt-4 flex-1 overflow-y-auto space-y-2 pr-1 min-h-[160px]">
							{studentsLoading ? (
								<div className="p-6 text-center text-xs text-[#71748d] flex flex-col items-center gap-2">
									<div className="w-5 h-5 border-2 border-white/20 border-t-[#7c3aed] rounded-full animate-spin" />
									<span>Loading students...</span>
								</div>
							) : students.length > 0 ? (
								students.map((student) => (
									<div
										key={student.id}
										className="flex items-center justify-between p-3 rounded-xl bg-[#141622] hover:bg-[#1b1e2e] border border-[#202334] transition-colors">
										<div className="flex items-center gap-3 min-w-0">
											<div className="w-10 h-10 rounded-full bg-[#7c3aed] text-white font-bold flex items-center justify-center text-sm shrink-0">
												{(student.name || "U")[0]?.toUpperCase()}
											</div>
											<div className="min-w-0">
												<h4 className="text-xs font-semibold text-white truncate">
													{student.name}
												</h4>
												<p className="text-[11px] text-[#71748d] truncate">
													{[student.department, student.yearOfStudy ? `Year ${student.yearOfStudy}` : null]
														.filter(Boolean)
														.join(" · ") || student.university || student.email}
												</p>
											</div>
										</div>

										<button
											type="button"
											disabled={startingChat}
											onClick={() => handleStartChatWithStudent(student)}
											className="px-3.5 py-1.5 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white text-xs font-semibold cursor-pointer shrink-0 transition-colors">
											{startingChat ? "Opening..." : "Chat"}
										</button>
									</div>
								))
							) : (
								<div className="p-6 text-center text-xs text-[#71748d]">
									No other students registered yet. Try searching or create a second test user account!
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MessagesPage;
