import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import CategoryPills from "../components/communities/CategoryPills";
import CommunityCard from "../components/communities/CommunityCard";

import roboticsImg from "../assets/robotics.jpg";
import cameraImg from "../assets/camera.jpg";
import businessImg from "../assets/business.jpg";
import musicImg from "../assets/music.jpg";
import sportsImg from "../assets/sports.jpg";

const INITIAL_COMMUNITIES = [
	{
		id: 1,
		name: "Coding Club",
		members: "1,247 members",
		category: "Technology",
		description:
			"Weekly coding challenges, hackathon prep, and open-source projects.",
		image:
			"https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
		isJoined: true,
		icon: (
			<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
			</svg>
		),
	},
	{
		id: 2,
		name: "AI & Robotics",
		members: "856 members",
		category: "Technology",
		description:
			"Exploring machine learning, computer vision, and autonomous systems.",
		image: roboticsImg,
		isJoined: false,
		icon: (
			<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
			</svg>
		),
	},
	{
		id: 3,
		name: "Photography Club",
		members: "642 members",
		category: "Arts",
		description:
			"Capture moments, share techniques, and explore visual storytelling.",
		image: cameraImg,
		isJoined: true,
		icon: (
			<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
			</svg>
		),
	},
	{
		id: 4,
		name: "Entrepreneurship Club",
		members: "934 members",
		category: "Business",
		description:
			"Turning ideas into startups. Pitching, networking, and funding.",
		image: businessImg,
		isJoined: false,
		icon: (
			<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
			</svg>
		),
	},
	{
		id: 5,
		name: "Music Society",
		members: "512 members",
		category: "Arts",
		description:
			"Jam sessions, performances, and music production workshops.",
		image: musicImg,
		isJoined: false,
		icon: (
			<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
			</svg>
		),
	},
	{
		id: 6,
		name: "Sports Club",
		members: "1,089 members",
		category: "Sports",
		description:
			"Inter-college sports, fitness challenges, and team tournaments.",
		image: sportsImg,
		isJoined: false,
		icon: (
			<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
			</svg>
		),
	},
];

const CommunitiesPage = ({ onNavigateTab }) => {
	const [communities, setCommunities] = useState(INITIAL_COMMUNITIES);
	const [activeCategory, setActiveCategory] = useState("All");

	const handleToggleJoin = (id) => {
		setCommunities((prev) =>
			prev.map((c) => (c.id === id ? { ...c, isJoined: !c.isJoined } : c))
		);
	};

	const filteredCommunities =
		activeCategory === "All"
			? communities
			: communities.filter(
					(c) => c.category.toLowerCase() === activeCategory.toLowerCase()
			  );

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
					user={{ name: "Alex Chen", avatar: "A" }}
				/>

				{/* Main Content Area */}
				<main className="flex-1 px-6 sm:px-8 py-6 flex flex-col gap-6">
					{/* Category Filter Pills */}
					<CategoryPills
						activeCategory={activeCategory}
						onSelectCategory={(category) => setActiveCategory(category)}
					/>

					{/* Communities Cards Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredCommunities.map((community) => (
							<CommunityCard
								key={community.id}
								community={community}
								onToggleJoin={handleToggleJoin}
							/>
						))}
					</div>
				</main>
			</div>
		</div>
	);
};

export default CommunitiesPage;
