import React, { useState } from "react";

const NoteCard = ({ note, onDownload }) => {
	const {
		code,
		title,
		department,
		semester,
		author,
		date,
		rating,
		downloads,
		pages,
	} = note;

	const [downloadCount, setDownloadCount] = useState(downloads);
	const [isDownloading, setIsDownloading] = useState(false);

	const handleDownload = () => {
		setIsDownloading(true);
		setTimeout(() => {
			setDownloadCount((prev) => prev + 1);
			setIsDownloading(false);
			if (onDownload) onDownload(note);
		}, 600);
	};

	return (
		<div className="flex flex-col bg-[#0d0f15] border border-[#1b1e2a] hover:border-[#272b3d] rounded-2xl p-5 transition-all duration-200 justify-between gap-5 group shadow-md hover:shadow-xl">
			{/* Top: Icon + Code Badge + Title + Department */}
			<div className="flex flex-col gap-3.5">
				{/* Top Header Row */}
				<div className="flex items-center justify-between">
					{/* Document Icon Box */}
					<div className="w-10 h-10 rounded-xl bg-[#141622] border border-[#202334] flex items-center justify-center shrink-0 text-[#a78bfa] group-hover:border-[#3b2b68] transition-colors">
						<svg
							className="w-5 h-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.8}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>

					{/* Course Code Badge */}
					<span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#241747] text-[#a78bfa] border border-[#3b2b68]">
						{code}
					</span>
				</div>

				{/* Title & Department */}
				<div className="flex flex-col gap-1">
					<h3 className="text-sm font-bold text-white tracking-tight leading-snug line-clamp-2 group-hover:text-[#c4b5fd] transition-colors">
						{title}
					</h3>
					<span className="text-xs text-[#71748d]">
						{department} · {semester}
					</span>
				</div>
			</div>

			{/* Bottom Section: Author + Metrics & Download */}
			<div className="flex flex-col gap-3 pt-3 border-t border-[#181a26]">
				{/* Author Row */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div
							className={`w-6 h-6 rounded-full ${
								author.avatarBg || "bg-[#10b981]"
							} text-white font-bold flex items-center justify-center text-[10px] shrink-0 select-none`}>
							{author.avatarText || author.name?.[0]}
						</div>
						<span className="text-xs text-[#c4c6dc] font-medium">
							{author.name}
						</span>
					</div>

					<span className="text-[11px] text-[#71748d]">{date}</span>
				</div>

				{/* Metrics & Download Button Row */}
				<div className="flex items-center justify-between pt-1">
					{/* Rating, Downloads, Pages */}
					<div className="flex items-center gap-2.5 text-xs text-[#8b8da4]">
						<div className="flex items-center gap-1 text-[#f59e0b] font-medium">
							<svg
								className="w-3.5 h-3.5 fill-[#f59e0b]"
								viewBox="0 0 24 24">
								<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
							</svg>
							<span>{rating}</span>
						</div>

						<div className="flex items-center gap-1 text-[#71748d]">
							<svg
								className="w-3.5 h-3.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
							<span>{downloadCount}</span>
						</div>

						<div className="flex items-center gap-1 text-[#71748d]">
							<svg
								className="w-3.5 h-3.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.8}
									d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
								/>
							</svg>
							<span>{pages}p</span>
						</div>
					</div>

					{/* Download Link */}
					<button
						type="button"
						onClick={handleDownload}
						disabled={isDownloading}
						className="text-xs font-semibold text-[#8b5cf6] hover:text-[#a78bfa] flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50">
						{isDownloading ? (
							<div className="w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
						) : (
							<svg
								className="w-3.5 h-3.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
						)}
						<span>{isDownloading ? "..." : "Download"}</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default NoteCard;
