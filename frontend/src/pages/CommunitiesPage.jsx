import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import CategoryPills from "../components/communities/CategoryPills";
import CommunityCard from "../components/communities/CommunityCard";
import { getCommunities, toggleJoin, createCommunity } from "../services/communityService";

// ── Fallback cover images (shown when a community has no banner set) ──────────
const FALLBACK_IMAGES = [
	"https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=800&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
];

const CATEGORIES = ["Technology", "Business", "Arts", "Academic", "Sports", "Gaming", "Music", "Other"];

function fallbackImage(index) {
	return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

/** Map a backend CommunityResponse to the shape CommunityCard expects. */
function adaptCommunity(c, index) {
	return {
		...c,
		// CommunityCard reads `members` as a display string
		members:
			c.memberCount !== undefined
				? `${c.memberCount.toLocaleString()} member${c.memberCount !== 1 ? "s" : ""}`
				: c.members || "0 members",
		// CommunityCard reads `image` for the banner
		image: c.banner || fallbackImage(index),
		// CommunityCard reads `isJoined` — backend sends `isMember` (normalized)
		isJoined: c.isMember ?? false,
		// Provide a generic icon if none stored
		icon: (
			<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.8}
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
		),
	};
}

// ── Create Community Modal ─────────────────────────────────────────────────────
function CreateCommunityModal({ onClose, onCreated }) {
	const [form, setForm] = useState({
		name: "",
		description: "",
		category: "Technology",
		tagsText: "",
		isPrivate: false,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.name.trim() || !form.description.trim()) {
			setError("Name and description are required.");
			return;
		}
		setLoading(true);
		setError("");
		try {
			const tags = form.tagsText
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean);
			const created = await createCommunity({
				name: form.name.trim(),
				description: form.description.trim(),
				category: form.category,
				tags,
				isPrivate: form.isPrivate,
			});
			onCreated(created);
			onClose();
		} catch (err) {
			setError(err.message || "Failed to create community.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
			onClick={(e) => e.target === e.currentTarget && onClose()}>
			<div className="bg-[#0d0f15] border border-[#1b1e2a] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-5 border-b border-[#1b1e2a]">
					<div>
						<h2 className="text-lg font-bold text-white">Create a Community</h2>
						<p className="text-xs text-[#595c73] mt-0.5">Build your tribe on campus</p>
					</div>
					<button
						onClick={onClose}
						className="w-8 h-8 flex items-center justify-center rounded-lg text-[#595c73] hover:text-white hover:bg-[#1b1e2a] transition-colors">
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
					{error && (
						<div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
							{error}
						</div>
					)}

					<div>
						<label className="block text-xs font-semibold text-[#8b8fa8] uppercase tracking-wider mb-1.5">
							Community Name *
						</label>
						<input
							type="text"
							value={form.name}
							onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
							placeholder="e.g. AI & Machine Learning"
							maxLength={80}
							className="w-full bg-[#12141e] border border-[#1b1e2a] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#595c73] focus:outline-none focus:border-[#6c63ff] transition-colors"
							required
						/>
					</div>

					<div>
						<label className="block text-xs font-semibold text-[#8b8fa8] uppercase tracking-wider mb-1.5">
							Description *
						</label>
						<textarea
							value={form.description}
							onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
							placeholder="What's this community about?"
							rows={3}
							maxLength={500}
							className="w-full bg-[#12141e] border border-[#1b1e2a] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#595c73] focus:outline-none focus:border-[#6c63ff] transition-colors resize-none"
							required
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-semibold text-[#8b8fa8] uppercase tracking-wider mb-1.5">
								Category
							</label>
							<select
								value={form.category}
								onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
								className="w-full bg-[#12141e] border border-[#1b1e2a] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors">
								{CATEGORIES.map((cat) => (
									<option key={cat} value={cat}>
										{cat}
									</option>
								))}
							</select>
						</div>
						<div className="flex flex-col justify-end">
							<label className="flex items-center gap-2 cursor-pointer pb-2.5">
								<div
									onClick={() => setForm((p) => ({ ...p, isPrivate: !p.isPrivate }))}
									className={`relative w-10 h-5 rounded-full transition-colors ${form.isPrivate ? "bg-[#6c63ff]" : "bg-[#1b1e2a]"}`}>
									<div
										className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isPrivate ? "translate-x-5" : "translate-x-0.5"}`}
									/>
								</div>
								<span className="text-sm text-[#d4d6e2]">Private</span>
							</label>
						</div>
					</div>

					<div>
						<label className="block text-xs font-semibold text-[#8b8fa8] uppercase tracking-wider mb-1.5">
							Tags (comma-separated)
						</label>
						<input
							type="text"
							value={form.tagsText}
							onChange={(e) => setForm((p) => ({ ...p, tagsText: e.target.value }))}
							placeholder="e.g. Python, AI, Research"
							className="w-full bg-[#12141e] border border-[#1b1e2a] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#595c73] focus:outline-none focus:border-[#6c63ff] transition-colors"
						/>
					</div>

					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 py-2.5 rounded-xl border border-[#1b1e2a] text-[#8b8fa8] text-sm font-medium hover:bg-[#1b1e2a] transition-colors">
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#a78bfa] text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
							{loading ? "Creating..." : "Create Community"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const CommunitiesPage = ({ onNavigateTab, currentUser }) => {
	const [communities, setCommunities] = useState([]);
	const [activeCategory, setActiveCategory] = useState("All");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showCreateModal, setShowCreateModal] = useState(false);

	const loadCommunities = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getCommunities(activeCategory);
			const adapted = (Array.isArray(data) ? data : []).map(adaptCommunity);
			setCommunities(adapted);
		} catch (err) {
			console.error("Failed to load communities:", err);
			setError("Could not load communities. Please try again.");
		} finally {
			setLoading(false);
		}
	}, [activeCategory]);

	useEffect(() => {
		loadCommunities();
	}, [loadCommunities]);

	const handleToggleJoin = async (id) => {
		// Optimistic toggle
		setCommunities((prev) =>
			prev.map((c) =>
				c.id === id
					? {
							...c,
							isJoined: !c.isJoined,
							memberCount: c.isJoined
								? Math.max(0, (c.memberCount || 0) - 1)
								: (c.memberCount || 0) + 1,
					  }
					: c
			)
		);

		try {
			const updated = await toggleJoin(id);
			// Sync authoritative state from server
			setCommunities((prev) =>
				prev.map((c) => (c.id === id ? adaptCommunity(updated, prev.indexOf(c)) : c))
			);
		} catch (err) {
			console.error("Failed to toggle join:", err);
			// Roll back
			setCommunities((prev) =>
				prev.map((c) =>
					c.id === id
						? {
								...c,
								isJoined: !c.isJoined,
								memberCount: c.isJoined
									? Math.max(0, (c.memberCount || 0) - 1)
									: (c.memberCount || 0) + 1,
						  }
						: c
				)
			);
		}
	};

	const handleCommunityCreated = (newCommunity) => {
		const adapted = adaptCommunity(newCommunity, communities.length);
		setCommunities((prev) => [adapted, ...prev]);
	};

	return (
		<div className="min-h-screen bg-[#07080b] text-white flex">
			{/* Left Fixed Sidebar */}
			<Sidebar activeTab="Communities" onSelectTab={onNavigateTab} />

			{/* Main Scrollable Content Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Top Navigation Bar */}
				<Header
					title="Communities"
					subtitle="Find your tribe on campus"
					user={
						currentUser
							? {
									name: currentUser.name || currentUser.fullName || currentUser.username || "You",
									avatar: (currentUser.name || currentUser.fullName || currentUser.username || "U")[0].toUpperCase(),
							  }
							: { name: "Campus Connect", avatar: "C" }
					}
				/>

				{/* Main Content Area */}
				<main className="flex-1 px-6 sm:px-8 py-6 flex flex-col gap-6">
					{/* Top bar: Category pills + Create button */}
					<div className="flex items-center justify-between gap-4 flex-wrap">
						<CategoryPills
							activeCategory={activeCategory}
							onSelectCategory={(category) => setActiveCategory(category)}
						/>
						<button
							onClick={() => setShowCreateModal(true)}
							className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#a78bfa] text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-purple-900/30 shrink-0">
							<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
							New Community
						</button>
					</div>

					{/* Communities Cards Grid */}
					{loading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{[1, 2, 3, 4].map((n) => (
								<div
									key={n}
									className="bg-[#0d0f15] border border-[#1b1e2a] rounded-2xl overflow-hidden animate-pulse">
									<div className="h-40 bg-[#12141e]" />
									<div className="p-5 flex flex-col gap-3">
										<div className="h-3 bg-[#1b1e2a] rounded w-2/3" />
										<div className="h-2 bg-[#1b1e2a] rounded w-1/2" />
										<div className="h-2 bg-[#1b1e2a] rounded w-full" />
										<div className="h-8 bg-[#1b1e2a] rounded-xl mt-2" />
									</div>
								</div>
							))}
						</div>
					) : error ? (
						<div className="text-center py-16 text-[#ef4444]">
							<p className="mb-3">{error}</p>
							<button
								onClick={loadCommunities}
								className="px-4 py-2 bg-[#1b1e2a] hover:bg-[#22263a] rounded-lg text-sm text-[#d4d6e2] transition-colors">
								Retry
							</button>
						</div>
					) : communities.length === 0 ? (
						<div className="text-center py-20 text-[#595c73]">
							<div className="w-16 h-16 rounded-2xl bg-[#1b1e2a] flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-[#595c73]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							</div>
							<p className="text-lg font-semibold text-[#d4d6e2] mb-1">No communities found</p>
							<p className="text-sm mb-6">Be the first to create one for this category!</p>
							<button
								onClick={() => setShowCreateModal(true)}
								className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#a78bfa] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
								<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
								Create Community
							</button>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{communities.map((community) => (
								<CommunityCard
									key={community.id}
									community={community}
									onToggleJoin={handleToggleJoin}
								/>
							))}
						</div>
					)}
				</main>
			</div>

			{/* Create Community Modal */}
			{showCreateModal && (
				<CreateCommunityModal
					onClose={() => setShowCreateModal(false)}
					onCreated={handleCommunityCreated}
				/>
			)}
		</div>
	);
};

export default CommunitiesPage;
