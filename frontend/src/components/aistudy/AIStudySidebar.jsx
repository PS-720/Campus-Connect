import React from "react";

const SUBJECTS = [
	"Computer Science",
	"Electronics",
	"Mathematics",
	"Mechanical",
	"Business",
	"Physics",
];

const AIStudySidebar = ({
	selectedSubject = "Computer Science",
	onSelectSubject,
	savedChats = [],
	activeChatId,
	onSelectChat,
	onNewChat,
}) => {
	return (
		<div className="w-64 h-full bg-[#0a0b0f] border-r border-[#151722] flex flex-col p-4 shrink-0 select-none">
			{/* Top Header Badge */}
			<div className="flex items-center gap-2.5 mb-5 px-1">
				<div className="w-8 h-8 rounded-lg bg-[#804bdf] flex items-center justify-center p-1.5 shadow-md shadow-purple-900/30">
					<svg
						className="w-full h-full text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
						/>
					</svg>
				</div>
				<span className="text-sm font-bold text-white tracking-tight">
					AI Study
				</span>
			</div>

			{/* New Chat Button */}
			<button
				type="button"
				onClick={onNewChat}
				className="w-full py-2.5 px-4 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold shadow-md shadow-purple-900/40 flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer active:scale-[0.99] mb-6">
				<span className="text-sm leading-none">+</span>
				<span>New Chat</span>
			</button>

			{/* Subject Dropdown */}
			<div className="flex flex-col gap-1.5 mb-6">
				<label className="text-[11px] font-bold tracking-wider text-[#4a4d65] uppercase px-1">
					Subject
				</label>
				<div className="relative">
					<select
						value={selectedSubject}
						onChange={(e) => onSelectSubject(e.target.value)}
						className="w-full bg-[#12141e] border border-[#1e202d] text-white text-xs rounded-xl px-3.5 py-2.5 pr-8 appearance-none cursor-pointer outline-none focus:border-[#7c3aed] transition-colors">
						{SUBJECTS.map((sub) => (
							<option key={sub} value={sub} className="bg-[#12141e]">
								{sub}
							</option>
						))}
					</select>
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#6b6e86]">
						<svg
							className="w-3.5 h-3.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>
				</div>
			</div>

			{/* Saved Chats List */}
			<div className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
				<label className="text-[11px] font-bold tracking-wider text-[#4a4d65] uppercase px-1 mb-1">
					Saved Chats
				</label>
				{savedChats.map((chat) => {
					const isActive = activeChatId === chat.id;
					return (
						<button
							key={chat.id}
							type="button"
							onClick={() => onSelectChat(chat.id)}
							className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
								isActive
									? "bg-[#181926] text-white font-medium border border-[#27293d]"
									: "text-[#8b8da4] hover:text-white hover:bg-[#12141e]"
							}`}>
							<svg
								className="w-4 h-4 text-[#71748d] shrink-0"
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
							<span className="truncate">{chat.title}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default AIStudySidebar;
