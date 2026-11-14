import React, { useState, useRef } from "react";
import { createPost, uploadPostMedia } from "../../services/postService";

const CreatePost = ({ onAddPost, userAvatar = "A", currentUser }) => {
	const [content, setContent] = useState("");
	const [attachedMedia, setAttachedMedia] = useState([]); // [{ id, file, previewUrl, type, name, size, isUploading, uploadedUrl, error }]
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const photoInputRef = useRef(null);
	const videoInputRef = useRef(null);
	const fileInputRef = useRef(null);

	const formatFileSize = (bytes) => {
		if (!bytes) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
	};

	const handleFileSelect = async (e, type) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;

		// Reset input value so re-selecting same file triggers event
		e.target.value = "";

		for (const file of files) {
			const tempId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
			const previewUrl = URL.createObjectURL(file);

			const newMediaItem = {
				id: tempId,
				file,
				previewUrl,
				type, // 'photo' | 'video' | 'file'
				name: file.name,
				size: file.size,
				isUploading: true,
				uploadedUrl: null,
				error: null,
			};

			setAttachedMedia((prev) => [...prev, newMediaItem]);

			// Upload immediately in background
			try {
				const uploadRes = await uploadPostMedia(file);
				setAttachedMedia((prev) =>
					prev.map((item) =>
						item.id === tempId
							? { ...item, isUploading: false, uploadedUrl: uploadRes.url }
							: item
					)
				);
			} catch (err) {
				console.error("Failed to upload media:", err);
				setAttachedMedia((prev) =>
					prev.map((item) =>
						item.id === tempId
							? { ...item, isUploading: false, error: "Upload failed" }
							: item
					)
				);
			}
		}
	};

	const removeMedia = (idToRemove) => {
		setAttachedMedia((prev) => {
			const item = prev.find((m) => m.id === idToRemove);
			if (item?.previewUrl && item.previewUrl.startsWith("blob:")) {
				URL.revokeObjectURL(item.previewUrl);
			}
			return prev.filter((m) => m.id !== idToRemove);
		});
	};

	const isUploadingAny = attachedMedia.some((m) => m.isUploading);

	const handlePost = async (e) => {
		e.preventDefault();
		const hasContent = content.trim().length > 0;
		const hasMedia = attachedMedia.length > 0;

		if ((!hasContent && !hasMedia) || isSubmitting || isUploadingAny) return;

		// Extract hashtags like #Coding or #AI/ML from the post text
		const hashTags = (content.match(/#[a-zA-Z0-9_\/]+/g) || []).map((t) =>
			t.replace("#", "")
		);
		const tags = hashTags.length > 0 ? hashTags : ["CampusLife"];

		// Filter successful uploads
		const mediaUrls = attachedMedia
			.map((m) => m.uploadedUrl)
			.filter(Boolean);

		setIsSubmitting(true);
		setError(null);
		try {
			const created = await createPost({
				content: content.trim() || (hasMedia ? "Attached media" : ""),
				tags,
				mediaUrls,
			});

			setContent("");
			// Clean up object URLs
			attachedMedia.forEach((m) => {
				if (m.previewUrl?.startsWith("blob:")) {
					URL.revokeObjectURL(m.previewUrl);
				}
			});
			setAttachedMedia([]);
			if (onAddPost) onAddPost(created); // push created PostResponse to parent
		} catch (err) {
			console.error("Failed to create post:", err);
			setError("Could not create post. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const avatarDisplay = currentUser?.name
		? currentUser.name.charAt(0).toUpperCase()
		: currentUser?.fullName
		? currentUser.fullName.charAt(0).toUpperCase()
		: currentUser?.username
		? currentUser.username.charAt(0).toUpperCase()
		: userAvatar;

	return (
		<div className="w-full bg-[#0d0f15] border border-[#1b1e2a] rounded-2xl p-5 shadow-sm transition-all">
			{/* Hidden File Inputs */}
			<input
				type="file"
				ref={photoInputRef}
				accept="image/*"
				multiple
				className="hidden"
				onChange={(e) => handleFileSelect(e, "photo")}
			/>
			<input
				type="file"
				ref={videoInputRef}
				accept="video/*"
				className="hidden"
				onChange={(e) => handleFileSelect(e, "video")}
			/>
			<input
				type="file"
				ref={fileInputRef}
				accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
				className="hidden"
				onChange={(e) => handleFileSelect(e, "file")}
			/>

			{/* Top input area with avatar */}
			<div className="flex gap-3.5 items-start">
				<div className="w-10 h-10 rounded-full bg-[#06b6d4] text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm select-none">
					{avatarDisplay}
				</div>
				<textarea
					rows={2}
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="What's happening on campus? Use #tags to categorize..."
					className="w-full bg-transparent text-sm text-white placeholder-[#585b73] outline-none resize-none pt-2"
				/>
			</div>

			{/* Attached Media Previews */}
			{attachedMedia.length > 0 && (
				<div className="mt-3.5 pt-3 border-t border-[#181a26]/80 flex flex-wrap gap-3">
					{attachedMedia.map((media) => (
						<div
							key={media.id}
							className="relative group rounded-xl overflow-hidden border border-[#252839] bg-[#12141f] p-2 flex items-center gap-3 max-w-full">
							{/* Image preview */}
							{media.type === "photo" && (
								<img
									src={media.previewUrl}
									alt="Upload preview"
									className="w-16 h-16 object-cover rounded-lg border border-[#2b2e42] shrink-0"
								/>
							)}

							{/* Video preview */}
							{media.type === "video" && (
								<div className="w-16 h-16 rounded-lg bg-[#181a26] border border-[#2b2e42] flex flex-col items-center justify-center text-[#a78bfa] shrink-0">
									<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.8}
											d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.8}
											d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
							)}

							{/* File / Doc preview */}
							{media.type === "file" && (
								<div className="w-16 h-16 rounded-lg bg-[#181a26] border border-[#2b2e42] flex flex-col items-center justify-center text-[#38bdf8] shrink-0">
									<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.8}
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
							)}

							{/* Details */}
							<div className="min-w-0 pr-6">
								<p className="text-xs font-medium text-white truncate max-w-[180px] sm:max-w-[240px]">
									{media.name}
								</p>
								<div className="flex items-center gap-2 mt-1">
									<span className="text-[11px] text-[#71748d]">
										{formatFileSize(media.size)}
									</span>
									{media.isUploading ? (
										<span className="text-[10px] text-[#f59e0b] font-medium flex items-center gap-1">
											<div className="w-2.5 h-2.5 border-2 border-[#f59e0b]/30 border-t-[#f59e0b] rounded-full animate-spin" />
											Uploading...
										</span>
									) : media.error ? (
										<span className="text-[10px] text-[#ef4444] font-medium">
											{media.error}
										</span>
									) : (
										<span className="text-[10px] text-[#10b981] font-medium flex items-center gap-0.5">
											✓ Ready
										</span>
									)}
								</div>
							</div>

							{/* Remove button */}
							<button
								type="button"
								onClick={() => removeMedia(media.id)}
								className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#1e202e] text-[#9ca3af] hover:text-white hover:bg-[#ef4444] flex items-center justify-center transition-colors cursor-pointer"
								title="Remove attachment">
								✕
							</button>
						</div>
					))}
				</div>
			)}

			{error && (
				<p className="text-xs text-[#ef4444] mt-2 ml-[3.375rem]">{error}</p>
			)}

			{/* Bottom actions row */}
			<div className="flex items-center justify-between pt-4 mt-2 border-t border-[#181a26]">
				<div className="flex items-center gap-1.5 sm:gap-2">
					{/* Photo */}
					<button
						type="button"
						onClick={() => photoInputRef.current?.click()}
						className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#7d8099] hover:text-[#c4c6dc] hover:bg-[#151722] transition-colors cursor-pointer">
						<svg className="w-4 h-4 text-[#7d8099]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.8}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<span>Photo</span>
					</button>

					{/* Video */}
					<button
						type="button"
						onClick={() => videoInputRef.current?.click()}
						className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#7d8099] hover:text-[#c4c6dc] hover:bg-[#151722] transition-colors cursor-pointer">
						<svg className="w-4 h-4 text-[#7d8099]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.8}
								d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
							/>
						</svg>
						<span>Video</span>
					</button>

					{/* File */}
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#7d8099] hover:text-[#c4c6dc] hover:bg-[#151722] transition-colors cursor-pointer">
						<svg className="w-4 h-4 text-[#7d8099]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.8}
								d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
							/>
						</svg>
						<span>File</span>
					</button>
				</div>

				{/* Post Button */}
				<button
					type="button"
					onClick={handlePost}
					disabled={
						(!content.trim() && attachedMedia.length === 0) ||
						isSubmitting ||
						isUploadingAny
					}
					className="px-5 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-purple-900/30 active:scale-[0.98] cursor-pointer flex items-center gap-1.5">
					{isSubmitting ? (
						<>
							<div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							<span>Posting...</span>
						</>
					) : isUploadingAny ? (
						<>
							<div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							<span>Uploading...</span>
						</>
					) : (
						"Post"
					)}
				</button>
			</div>
		</div>
	);
};

export default CreatePost;
