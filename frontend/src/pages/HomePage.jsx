import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import CreatePost from "../components/feed/CreatePost";
import TopicFilters from "../components/feed/TopicFilters";
import PostCard from "../components/feed/PostCard";
import UpcomingEvents from "../components/widgets/UpcomingEvents";
import JoinCommunities from "../components/widgets/JoinCommunities";
import AiStudyTip from "../components/widgets/AiStudyTip";
import hackathonImg from "../assets/hackathon.jpg";

const INITIAL_POSTS = [
	{
		id: 1,
		author: {
			name: "Priya Sharma",
			avatarText: "P",
			avatarBg: "bg-[#10b981]",
			department: "Computer Science",
			year: "3rd Year",
		},
		time: "2h ago",
		tags: ["Hackathon", "AI/ML"],
		content:
			"Just won first place at the Inter-College Hackathon! Our team built an AI-powered campus navigation system using real-time data. So grateful for everyone who supported us! 🚀",
		image: hackathonImg,
		likes: 142,
		comments: 28,
		shares: 12,
	},
	{
		id: 2,
		author: {
			name: "Marcus Johnson",
			avatarText: "M",
			avatarBg: "bg-[#06b6d4]",
			department: "Electrical Eng.",
			year: "2nd Year",
		},
		time: "4h ago",
		tags: ["Open Source", "Coding"],
		content:
			"Working on our autonomous robotics rover project in the lab today! Anyone interested in embedded systems and ROS2, let me know. We have open spots for the upcoming semester competition! 🤖⚡",
		image: null,
		likes: 89,
		comments: 14,
		shares: 7,
	},
	{
		id: 3,
		author: {
			name: "Ananya Patel",
			avatarText: "A",
			avatarBg: "bg-[#8b5cf6]",
			department: "Design & Media",
			year: "4th Year",
		},
		time: "6h ago",
		tags: ["Design", "CampusLife"],
		content:
			"UX research survey for our new campus library study pod reservation system is live. Please fill it out if you have 2 mins! Appreciate the feedback! ✨",
		image: null,
		likes: 56,
		comments: 9,
		shares: 4,
	},
];

const HomePage = ({ onNavigateTab }) => {
	const [posts, setPosts] = useState(INITIAL_POSTS);
	const [selectedTopic, setSelectedTopic] = useState(null);

	const handleAddPost = (newPost) => {
		setPosts([newPost, ...posts]);
	};

	const filteredPosts = selectedTopic
		? posts.filter(
				(p) =>
					p.tags?.some(
						(t) =>
							t.toLowerCase() ===
							selectedTopic.replace("#", "").toLowerCase()
					) || p.content.toLowerCase().includes(selectedTopic.toLowerCase())
		  )
		: posts;

	return (
		<div className="min-h-screen bg-[#07080b] text-white flex">
			{/* Left Fixed Sidebar */}
			<Sidebar activeTab="Home" onSelectTab={onNavigateTab} />

			{/* Main Scrollable Content Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Top Navigation Bar */}
				<Header
					title="Home"
					subtitle="What's happening on campus"
					user={{ name: "Alex Chen", avatar: "A" }}
				/>

				{/* Two-column feed + widgets layout */}
				<main className="flex-1 px-6 sm:px-8 py-6 flex gap-8">
					{/* Center Feed Column */}
					<div className="flex-1 min-w-0 flex flex-col gap-5">
						{/* Create Post Card */}
						<CreatePost onAddPost={handleAddPost} userAvatar="A" />

						{/* Hashtag Filters */}
						<TopicFilters
							selectedTopic={selectedTopic}
							onSelectTopic={(topic) => setSelectedTopic(topic)}
						/>

						{/* Posts Feed */}
						<div className="flex flex-col gap-5">
							{filteredPosts.map((post) => (
								<PostCard key={post.id} post={post} />
							))}
						</div>
					</div>

					{/* Right Sidebar Widgets */}
					<div className="hidden lg:flex flex-col gap-6 w-80 shrink-0 sticky top-24 self-start">
						{/* Upcoming Events */}
						<UpcomingEvents
							onSeeAll={() => console.log("See all events clicked")}
						/>

						{/* Join Communities */}
						<JoinCommunities
							onBrowse={() => onNavigateTab && onNavigateTab("Communities")}
						/>

						{/* AI Study Tip */}
						<AiStudyTip
							onStartQuiz={() => console.log("Start Quiz clicked")}
						/>
					</div>
				</main>
			</div>
		</div>
	);
};

export default HomePage;
