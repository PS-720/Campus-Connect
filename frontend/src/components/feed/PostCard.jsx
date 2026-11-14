import React, { useState, useEffect } from "react";
import {
	toggleLike,
	toggleBookmark,
	getComments,
	addComment,
	resolveMediaUrl,
} from "../../services/postService";

// Helper to pick a deterministic avatar colour from an author name
const AVATAR_COLORS = [
	"bg-[#10b981]",
	"bg-[#06b6d4]",
	"bg-[#8b5cf6]",
	"bg-[#f59e0b]",
	"bg-[#ef4444]",
	"bg-[#3b82f6]",
];
function avatarColor(name = "") {
	let h = 0;
	for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
	return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function getMediaInfo(rawUrl) {
	const url = resolveMediaUrl(rawUrl);
	const clean = url.split("?")[0].toLowerCase();
	let type = "image";
	if (clean.match(/\.(mp4|webm|ogg|mov|mkv)$/i)) {
		type = "video";
	} else if (
		clean.match(/\.(pdf|doc|docx|ppt|pptx|xls|xlsx|txt|zip|tar|gz)$/i)
	) {
		type = "file";
	}

	let name = rawUrl.substring(rawUrl.lastIndexOf("/") + 1);
	const underscoreIdx = name.indexOf("_");
	if (underscoreIdx > 10 && underscoreIdx < 45) {
		name = name.substring(underscoreIdx + 1);
	}
	return { url, type, name: decodeURIComponent(name || "attachment") };
}

const PostCard = ({ post, currentUser, onPostUpdated }) => {
	// ── Local mirror of server state ─────────────────────────────────────────────
	const [likes, setLikes] = useState(post.likesCount ?? post.likes ?? 0);
	const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
	const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked ?? false);
	const [commentCount, setCommentCount] = useState(
		post.commentsCount ?? post.comments ?? 0
	);

	// ── Comments panel ───────────────────────────────────────────────────────────
	const [showComments, setShowComments] = useState(false);
	const [comments, setComments] = useState([]);
	const [commentsLoaded, setCommentsLoaded] = useState(false);
	const [commentInput, setCommentInput] = useState("");
	const [commentLoading, setCommentLoading] = useState(false);

	// Keep local state in sync if parent re-renders with updated post data
	useEffect(() => {
		setLikes(post.likesCount ?? post.likes ?? 0);
		setIsLiked(post.isLiked ?? false);
		setIsBookmarked(post.isBookmarked ?? false);
		setCommentCount(post.commentsCount ?? post.comments ?? 0);
	}, [post]);

	// ── Load comments when panel is opened for the first time ───────────────────
	useEffect(() => {
		if (showComments && !commentsLoaded) {
			getComments(post.id)
				.then((data) => {
					setComments(Array.isArray(data) ? data : []);
					setCommentsLoaded(true);
				})
				.catch((err) => console.error("Failed to load comments:", err));
		}
	}, [showComments, commentsLoaded, post.id]);

	// ── Like / Bookmark handlers ─────────────────────────────────────────────────
	const handleLike = async () => {
		// Optimistic update
		const next = !isLiked;
		setIsLiked(next);
		setLikes((prev) => (next ? prev + 1 : prev - 1));

		try {
			const updated = await toggleLike(post.id);
			// Sync authoritative count from server
			if (updated) {
				setLikes(updated.likesCount ?? likes);
				setIsLiked(updated.isLiked ?? next);
				onPostUpdated?.(updated);
			}
		} catch (err) {
			// Roll back on failure
			setIsLiked(!next);
			setLikes((prev) => (!next ? prev + 1 : prev - 1));
			console.error("Like toggle failed:", err);
		}
	};

	const handleBookmark = async () => {
		const next = !isBookmarked;
		setIsBookmarked(next);
		try {
			const updated = await toggleBookmark(post.id);
			if (updated) {
				setIsBookmarked(updated.isBookmarked ?? next);
				onPostUpdated?.(updated);
			}
		} catch (err) {
			setIsBookmarked(!next);
			console.error("Bookmark toggle failed:", err);
		}
	};

	// ── Add Comment ──────────────────────────────────────────────────────────────
	const handleAddComment = async (e) => {
		e.preventDefault();
		if (!commentInput.trim() || commentLoading) return;
		setCommentLoading(true);
		try {
			const newComment = await addComment(post.id, commentInput.trim());
			setComments((prev) => [...prev, newComment]);
			setCommentCount((prev) => prev + 1);
			setCommentInput("");
		} catch (err) {
			console.error("Comment submission failed:", err);
		} finally {
			setCommentLoading(false);
		}
	};

	// ── Derive author display fields ─────────────────────────────────────────────
	const authorName =
		post.author?.name ||
		post.author?.fullName ||
		post.authorName ||
		"Unknown";
	const avatarText = post.author?.avatarText || authorName[0]?.toUpperCase() || "U";
	const avatarBg = post.author?.avatarBg || avatarColor(authorName);
	const department =
		post.author?.department || post.authorDepartment || "";
	const year = post.author?.year || post.authorYear || "";
	const timeAgo = post.time || post.createdAt || "";

	const rawMediaUrls =
		post.mediaUrls && post.mediaUrls.length > 0
			? post.mediaUrls
			: post.image
			? [post.image]
			: [];
	const mediaList = rawMediaUrls.map(getMediaInfo);

	return (
		<article className="w-full bg-[#0d0f15] border border-[#1b1e2a] rounded-2xl p-5 shadow-sm transition-colors">
			{/* Author Header */}
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-3">
					{/* Avatar */}
					<div
						className={`w-10 h-10 rounded-full ${avatarBg} text-white font-bold flex items-center justify-center text-sm shrink-0 select-none shadow-sm`}>
						{avatarText}
					</div>

					{/* Author info & tags */}
					<div>
						<div className="flex items-center gap-2 flex-wrap">
							<span className="font-semibold text-white text-sm">
								{authorName}
							</span>
							{(department || year) && (
								<>
									<span className="text-xs text-[#71748d]">·</span>
									<span className="text-xs text-[#8b8da4]">
										{[department, year].filter(Boolean).join(" · ")}
									</span>
								</>
							)}
							{timeAgo && (
								<>
									<span className="text-xs text-[#71748d]">·</span>
									<span className="text-xs text-[#71748d]">{timeAgo}</span>
								</>
							)}
						</div>

						{/* Tags */}
						{post.tags && post.tags.length > 0 && (
							<div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
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
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
						/>
					</svg>
				</button>
			</div>

			{/* Post Content */}
			<p className="text-sm text-[#d4d6e2] mt-4 leading-relaxed whitespace-pre-line">
				{post.content}
			</p>

			{/* Attached Media List */}
			{mediaList.length > 0 && (
				<div className="mt-4 space-y-3">
					{mediaList.map((media, idx) => {
						if (media.type === "video") {
							return (
								<div
									key={idx}
									className="rounded-xl overflow-hidden border border-[#1e202e] bg-[#07080b]">
									<video
										src={media.url}
										controls
										playsInline
										preload="metadata"
										className="w-full max-h-[440px] bg-black object-contain"
									/>
								</div>
							);
						}

						if (media.type === "file") {
							return (
								<a
									key={idx}
									href={media.url}
									target="_blank"
									rel="noopener noreferrer"
									download
									className="flex items-center justify-between p-3.5 rounded-xl border border-[#232638] bg-[#12141e] hover:bg-[#181a28] hover:border-[#383b54] transition-all group cursor-pointer">
									<div className="flex items-center gap-3 min-w-0">
										<div className="w-10 h-10 rounded-lg bg-[#1f2233] flex items-center justify-center text-[#93c5fd] shrink-0 group-hover:scale-105 transition-transform">
											<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1.8}
													d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
												/>
											</svg>
										</div>
										<div className="min-w-0">
											<p className="text-xs font-semibold text-white truncate">
												{media.name}
											</p>
											<p className="text-[11px] text-[#71748d]">
												Click to view or download file
											</p>
										</div>
									</div>
									<div className="text-xs font-medium text-[#818cf8] px-2.5 py-1 rounded-md bg-[#241747] border border-[#3b2b68] shrink-0">
										Download
									</div>
								</a>
							);
						}

						// Image default
						return (
							<div
								key={idx}
								className="rounded-xl overflow-hidden border border-[#1e202e] bg-[#07080b]">
								<img
									src={media.url}
									alt="Post attachment"
									loading="lazy"
									className="w-full max-h-[440px] object-cover object-center cursor-pointer hover:opacity-95 transition-opacity"
									onClick={() => window.open(media.url, "_blank")}
								/>
							</div>
						);
					})}
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
						onClick={() => setShowComments((s) => !s)}
						className="flex items-center gap-1.5 text-xs font-medium text-[#7d8099] hover:text-white transition-colors cursor-pointer">
						<svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
						<span>{commentCount}</span>
					</button>

					{/* Share Button */}
					<button
						type="button"
						onClick={() => {
							navigator.clipboard?.writeText(window.location.href);
						}}
						title="Copy link"
						className="flex items-center gap-1.5 text-xs font-medium text-[#7d8099] hover:text-white transition-colors cursor-pointer">
						<svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
							/>
						</svg>
					</button>
				</div>

				{/* Bookmark Button */}
				<button
					type="button"
					onClick={handleBookmark}
					title={isBookmarked ? "Remove bookmark" : "Bookmark"}
					className={`p-1 transition-colors cursor-pointer ${
						isBookmarked ? "text-[#a78bfa]" : "text-[#7d8099] hover:text-white"
					}`}>
					<svg
						className={`w-4.5 h-4.5 ${isBookmarked ? "fill-[#a78bfa]" : "fill-none"}`}
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.8}>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
						/>
					</svg>
				</button>
			</div>

			{/* ── Expandable Comments Section ─────────────────────────────────────── */}
			{showComments && (
				<div className="mt-4 pt-4 border-t border-[#181a26] flex flex-col gap-3">
					{/* Comment list */}
					{!commentsLoaded ? (
						<p className="text-xs text-[#595c73]">Loading comments…</p>
					) : comments.length === 0 ? (
						<p className="text-xs text-[#595c73]">
							No comments yet. Be the first!
						</p>
					) : (
						<div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
							{comments.map((c) => {
								const cName = c.author?.name || c.authorName || "User";
								return (
									<div key={c.id} className="flex items-start gap-2">
										<div
											className={`w-7 h-7 rounded-full ${avatarColor(cName)} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
											{cName[0]?.toUpperCase()}
										</div>
										<div className="bg-[#12141f] rounded-xl px-3 py-2 flex-1">
											<span className="font-semibold text-white text-xs mr-2">
												{cName}
											</span>
											<span className="text-xs text-[#d4d6e2]">{c.content}</span>
										</div>
									</div>
								);
							})}
						</div>
					)}

					{/* Add comment input */}
					{currentUser ? (
						<form onSubmit={handleAddComment} className="flex items-center gap-2 mt-1">
							<div
								className={`w-7 h-7 rounded-full ${avatarColor(
									currentUser.fullName || currentUser.username || "U"
								)} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
								{(currentUser.fullName || currentUser.username || "U")[0].toUpperCase()}
							</div>
							<input
								type="text"
								value={commentInput}
								onChange={(e) => setCommentInput(e.target.value)}
								placeholder="Write a comment…"
								className="flex-1 bg-[#12141f] border border-[#1b1e2a] rounded-xl px-3 py-1.5 text-xs text-[#d4d6e2] placeholder-[#595c73] focus:outline-none focus:border-[#7c3aed] transition-colors"
							/>
							<button
								type="submit"
								disabled={!commentInput.trim() || commentLoading}
								className="px-3 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-semibold text-white transition-colors">
								{commentLoading ? "…" : "Post"}
							</button>
						</form>
					) : (
						<p className="text-xs text-[#595c73]">Log in to comment.</p>
					)}
				</div>
			)}
		</article>
	);
};

export default PostCard;
