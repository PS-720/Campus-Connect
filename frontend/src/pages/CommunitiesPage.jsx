import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import CategoryPills from "../components/communities/CategoryPills";
import CommunityCard from "../components/communities/CommunityCard";
import { getCommunities, toggleJoin } from "../services/communityService";

// ── Fallback cover images (shown when a community has no banner set) ──────────
const FALLBACK_IMAGES = [
	"https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=800&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
];

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
		// CommunityCard reads `isJoined`
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

const CommunitiesPage = ({ onNavigateTab, currentUser }) => {
	const [communities, setCommunities] = useState([]);
	const [activeCategory, setActiveCategory] = useState("All");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

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
									name: currentUser.fullName || currentUser.username || "You",
									avatar: (currentUser.fullName || currentUser.username || "U")[0].toUpperCase(),
							  }
							: { name: "Campus Connect", avatar: "C" }
					}
				/>

				{/* Main Content Area */}
				<main className="flex-1 px-6 sm:px-8 py-6 flex flex-col gap-6">
					{/* Category Filter Pills */}
					<CategoryPills
						activeCategory={activeCategory}
						onSelectCategory={(category) => setActiveCategory(category)}
					/>

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
							<p className="text-lg font-semibold mb-1">No communities found</p>
							<p className="text-sm">Be the first to create one!</p>
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
		</div>
	);
};

export default CommunitiesPage;
