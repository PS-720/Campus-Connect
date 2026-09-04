import React, { useState } from "react";

const PostCard = ({ post }) => {
	const [likes, setLikes] = useState(post.likes || 0);
	const [isLiked, setIsLiked] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [showComments, setShowComments] = useState(false);

	const handleLike = () => {
		if (isLiked) {
			setLikes((prev) => prev - 1);
			setIsLiked(false);
		} else {
			setLikes((prev) => prev + 1);
			setIsLiked(true);
		}
	};

	return (
		<article className="w-full bg-[#0d0f15] border border-[#1b1e2a] rounded-2xl p-5 shadow-sm transition-colors">
			{/* Author Header */}
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-3">
					{/* Avatar */}
					<div
						className={`w-10 h-10 rounded-full ${
							post.author.avatarBg || "bg-[#10b981]"
						} text-white font-bold flex items-center justify-center text-sm shrink-0 select-none shadow-sm`}>
						{post.author.avatarText || post.author.name?.[0] || "U"}
					</div>

					{/* Author info & tags */}
					<div>
						<div className="flex items-center gap-2 flex-wrap">
							<span className="font-semibold text-white text-sm">
								{post.author.name}
							</span>
							<span className="text-xs text-[#71748d]">·</span>
							<span className="text-xs text-[#8b8da4]">
								{post.author.department} · {post.author.year}
							</span>
							<span className="text-xs text-[#71748d]">·</span>
							<span className="text-xs text-[#71748d]">{post.time}</span>
						</div>

						{/* Tags */}
						{post.tags && post.tags.length > 0 && (
							<div className="flex items-center gap-1.5 mt-1.5">
								{post.tags.map((tag) => (
									<span
										key={tag}
										className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#241747] text-[#a78bfa] border border-[#3b2b68]">
										{tag}
									</span>
								))}
							</div>
						)}
					</div>
				</div>

				{/* More menu */}
				<button
					type="button"
					aria-label="More options"
					className="text-[#595c73] hover:text-[#c4c6dc] p-1 rounded-lg transition-colors cursor-pointer">
					<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
					</svg>
				</button>
			</div>

			{/* Post Content */}
			<p className="text-sm text-[#d4d6e2] mt-4 leading-relaxed whitespace-pre-line">
				{post.content}
			</p>

			{/* Attached Media Image */}
			{post.image && (
				<div className="mt-4 rounded-xl overflow-hidden border border-[#1e202e] bg-[#07080b]">
					<img
						src={post.image}
						alt="Post attachment"
						className="w-full max-h-[380px] object-cover object-center"
					/>
				</div>
			)}

			{/* Action Footer */}
			<div className="flex items-center justify-between pt-4 mt-4 border-t border-[#181a26]">
				<div className="flex items-center gap-6">
					{/* Like Button */}
					<button
						type="button"
						onClick={handleLike}
						className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
							isLiked ? "text-[#ef4444]" : "text-[#7d8099] hover:text-white"
						}`}>
						<svg
							className={`w-4.5 h-4.5 ${isLiked ? "fill-[#ef4444]" : "fill-none"}`}
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.8}>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							/>
						</svg>
						<span>{likes}</span>
					</button>

					{/* Comments Button */}
					<button
						type="button"
						onClick={() => setShowComments(!showComments)}
						className="flex items-center gap-1.5 text-xs font-medium text-[#7d8099] hover:text-white transition-colors cursor-pointer">
						<svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
						<span>{post.comments || 0}</span>
					</button>

					{/* Share Button */}
					<button
						type="button"
						className="flex items-center gap-1.5 text-xs font-medium text-[#7d8099] hover:text-white transition-colors cursor-pointer">
						<svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
						</svg>
					</button>
				</div>

				{/* Bookmark Button */}
				<button
					type="button"
					onClick={() => setIsSaved(!isSaved)}
					className={`p-1 transition-colors cursor-pointer ${
						isSaved ? "text-[#a78bfa]" : "text-[#7d8099] hover:text-white"
					}`}>
					<svg
						className={`w-4.5 h-4.5 ${isSaved ? "fill-[#a78bfa]" : "fill-none"}`}
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.8}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
					</svg>
				</button>
			</div>
		</article>
	);
};

export default PostCard;
