import React, { useState } from "react";

const ChatView = ({ conversation, onSendMessage, onBack }) => {
	const [inputText, setInputText] = useState("");

	if (!conversation) return null;

	const handleSend = (e) => {
		e.preventDefault();
		if (!inputText.trim()) return;
		onSendMessage(conversation.id, inputText.trim());
		setInputText("");
	};

	return (
		<div className="flex-1 flex flex-col h-full bg-[#07080b]">
			{/* Chat Top Header */}
			<div className="px-6 py-4 border-b border-[#151722] flex items-center justify-between gap-4 bg-[#0a0b0f]">
				<div className="flex items-center gap-3">
					{onBack && (
						<button
							type="button"
							onClick={onBack}
							className="md:hidden p-1.5 rounded-lg text-[#8b8da4] hover:text-white hover:bg-[#151722]">
							<svg
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</button>
					)}
					<div
						className={`w-10 h-10 rounded-full ${
							conversation.avatarBg || "bg-[#10b981]"
						} text-white font-bold flex items-center justify-center text-sm shadow-sm select-none`}>
						{conversation.avatarText || conversation.name?.[0]}
					</div>
					<div>
						<h3 className="text-sm font-bold text-white tracking-tight">
							{conversation.name}
						</h3>
						<span className="text-[11px] text-[#71748d]">
							{conversation.subtitle ||
								(conversation.isOnline ? "Active now" : "Offline")}
						</span>
					</div>
				</div>

				{/* Header Actions */}
				<div className="flex items-center gap-2 text-[#71748d]">
					<button
						type="button"
						className="p-2 rounded-xl hover:text-white hover:bg-[#151722] transition-colors">
						<svg
							className="w-4.5 h-4.5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.8}
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
					</button>
					<button
						type="button"
						className="p-2 rounded-xl hover:text-white hover:bg-[#151722] transition-colors">
						<svg
							className="w-4.5 h-4.5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
							/>
						</svg>
					</button>
				</div>
			</div>

			{/* Messages Feed */}
			<div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
				{(conversation.messages || []).map((msg) => {
					const isMe = msg.isMe;
					return (
						<div
							key={msg.id}
							className={`flex flex-col max-w-[70%] ${
								isMe ? "self-end items-end" : "self-start items-start"
							}`}>
							<div
								className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
									isMe
										? "bg-[#7c3aed] text-white rounded-br-xs shadow-md shadow-purple-950/40"
										: "bg-[#141622] text-[#d4d6e2] border border-[#202334] rounded-bl-xs"
								}`}>
								{msg.text}
							</div>
							<span className="text-[10px] text-[#71748d] mt-1 px-1">
								{msg.time}
							</span>
						</div>
					);
				})}
			</div>

			{/* Chat Input Bar */}
			<form
				onSubmit={handleSend}
				className="p-4 border-t border-[#151722] bg-[#0a0b0f] flex items-center gap-3">
				<button
					type="button"
					className="p-2 rounded-xl text-[#71748d] hover:text-white hover:bg-[#141622] transition-colors">
					<svg
						className="w-5 h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.8}
							d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
						/>
					</svg>
				</button>

				<input
					type="text"
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
					placeholder="Type a message..."
					className="flex-1 bg-[#12141e] border border-[#1e202d] focus:border-[#7c3aed] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#50536c] outline-none"
				/>

				<button
					type="submit"
					disabled={!inputText.trim()}
					className="px-4 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-all cursor-pointer">
					Send
				</button>
			</form>
		</div>
	);
};

export default ChatView;
