import React from "react";

const ConversationItem = ({ conversation, isSelected, onClick }) => {
	const {
		name,
		lastMessage,
		time,
		unreadCount,
		avatarText,
		avatarBg,
		isOnline,
	} = conversation;

	return (
		<button
			type="button"
			onClick={onClick}
			className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl transition-all duration-150 text-left cursor-pointer ${
				isSelected
					? "bg-[#181926] border border-[#2b2d42]"
					: "hover:bg-[#12141e] border border-transparent"
			}`}>
			{/* Avatar with optional online dot */}
			<div className="relative shrink-0">
				<div
					className={`w-11 h-11 rounded-full ${
						avatarBg || "bg-[#10b981]"
					} text-white font-bold flex items-center justify-center text-sm shadow-sm select-none`}>
					{avatarText || name?.[0] || "U"}
				</div>
				{isOnline && (
					<span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] border-2 border-[#0a0b0f] rounded-full" />
				)}
			</div>

			{/* Info */}
			<div className="flex-1 min-w-0">
				{/* Name & Time */}
				<div className="flex items-center justify-between gap-1 mb-1">
					<h4 className="text-sm font-semibold text-white tracking-tight truncate">
						{name}
					</h4>
					<span className="text-[11px] text-[#71748d] shrink-0">{time}</span>
				</div>

				{/* Snippet & Unread badge */}
				<div className="flex items-center justify-between gap-2">
					<p
						className={`text-xs truncate ${
							unreadCount ? "text-[#c4c6dc] font-medium" : "text-[#71748d]"
						}`}>
						{lastMessage}
					</p>

					{unreadCount > 0 && (
						<span className="min-w-4.5 h-4.5 px-1.5 rounded-full bg-[#7c3aed] text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-sm shadow-purple-900/50">
							{unreadCount}
						</span>
					)}
				</div>
			</div>
		</button>
	);
};

export default ConversationItem;
