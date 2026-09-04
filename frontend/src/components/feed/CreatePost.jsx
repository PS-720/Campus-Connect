import React, { useState } from "react";

const CreatePost = ({ onAddPost, userAvatar = "A" }) => {
	const [content, setContent] = useState("");
	const [activeMedia, setActiveMedia] = useState(null);

	const handlePost = (e) => {
		e.preventDefault();
		if (!content.trim()) return;

		if (onAddPost) {
			onAddPost({
				id: Date.now(),
				author: {
					name: "Alex Chen",
					avatarText: "A",
					avatarBg: "bg-[#06b6d4]",
					department: "Computer Science",
					year: "1st Year",
				},
				time: "Just now",
				tags: ["CampusLife"],
				content: content,
				image: null,
				likes: 0,
				comments: 0,
				shares: 0,
			});
		}
		setContent("");
		setActiveMedia(null);
	};

	return (
		<div className="w-full bg-[#0d0f15] border border-[#1b1e2a] rounded-2xl p-5 shadow-sm">
			{/* Top input area with avatar */}
			<div className="flex gap-3.5 items-start">
				<div className="w-10 h-10 rounded-full bg-[#06b6d4] text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm select-none">
					{userAvatar}
				</div>
				<textarea
					rows={2}
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="What's happening on campus?"
					className="w-full bg-transparent text-sm text-white placeholder-[#585b73] outline-none resize-none pt-2"
				/>
			</div>

			{/* Bottom actions row */}
			<div className="flex items-center justify-between pt-4 mt-2 border-t border-[#181a26]">
				<div className="flex items-center gap-1.5 sm:gap-2">
					{/* Photo */}
					<button
						type="button"
						onClick={() => setActiveMedia(activeMedia === "photo" ? null : "photo")}
						className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#7d8099] hover:text-[#c4c6dc] hover:bg-[#151722] transition-colors cursor-pointer">
						<svg className="w-4 h-4 text-[#7d8099]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						<span>Photo</span>
					</button>

					{/* Video */}
					<button
						type="button"
						onClick={() => setActiveMedia(activeMedia === "video" ? null : "video")}
						className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#7d8099] hover:text-[#c4c6dc] hover:bg-[#151722] transition-colors cursor-pointer">
						<svg className="w-4 h-4 text-[#7d8099]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
						</svg>
						<span>Video</span>
					</button>

					{/* File */}
					<button
						type="button"
						onClick={() => setActiveMedia(activeMedia === "file" ? null : "file")}
						className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#7d8099] hover:text-[#c4c6dc] hover:bg-[#151722] transition-colors cursor-pointer">
						<svg className="w-4 h-4 text-[#7d8099]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
						</svg>
						<span>File</span>
					</button>
				</div>

				{/* Post Button */}
				<button
					type="button"
					onClick={handlePost}
					disabled={!content.trim()}
					className="px-5 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-purple-900/30 active:scale-[0.98] cursor-pointer">
					Post
				</button>
			</div>
		</div>
	);
};

export default CreatePost;
