import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import CreatePost from "../components/feed/CreatePost";
import TopicFilters from "../components/feed/TopicFilters";
import PostCard from "../components/feed/PostCard";
import UpcomingEvents from "../components/widgets/UpcomingEvents";
import JoinCommunities from "../components/widgets/JoinCommunities";
import AiStudyTip from "../components/widgets/AiStudyTip";
import { getFeed } from "../services/postService";

const HomePage = ({ onNavigateTab, currentUser }) => {
	const [posts, setPosts] = useState([]);
	const [selectedTopic, setSelectedTopic] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Load feed from backend whenever the selected topic filter changes
	const loadFeed = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getFeed(selectedTopic);
			setPosts(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error("Failed to load feed:", err);
			setError("Could not load posts. Please try again.");
		} finally {
			setLoading(false);
		}
	}, [selectedTopic]);

	useEffect(() => {
		loadFeed();
	}, [loadFeed]);

	// Called by CreatePost when a new post is successfully created on the backend
	const handleAddPost = useCallback((newPost) => {
		setPosts((prev) => [newPost, ...prev]);
	}, []);

	// Called by PostCard when a post is mutated (liked, bookmarked, commented)
	const handlePostUpdated = useCallback((updatedPost) => {
		setPosts((prev) =>
			prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
		);
	}, []);

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
					user={
						currentUser
							? {
									name: currentUser.name || currentUser.fullName || currentUser.username || "You",
									avatar: (currentUser.name || currentUser.fullName || currentUser.username || "U")[0].toUpperCase(),
							  }
							: { name: "Campus Connect", avatar: "C" }
					}
				/>

				{/* Two-column feed + widgets layout */}
				<main className="flex-1 px-6 sm:px-8 py-6 flex gap-8">
					{/* Center Feed Column */}
					<div className="flex-1 min-w-0 flex flex-col gap-5">
						<CreatePost
							onAddPost={handleAddPost}
							currentUser={currentUser}
						/>

						{/* Hashtag Filters */}
						<TopicFilters
							selectedTopic={selectedTopic}
							onSelectTopic={(topic) => setSelectedTopic(topic)}
						/>

						{/* Posts Feed */}
						{loading ? (
							<div className="flex flex-col gap-4">
								{[1, 2, 3].map((n) => (
									<div
										key={n}
										className="w-full bg-[#0d0f15] border border-[#1b1e2a] rounded-2xl p-5 animate-pulse">
										<div className="flex items-center gap-3 mb-4">
											<div className="w-10 h-10 rounded-full bg-[#1b1e2a]" />
											<div className="flex-1 space-y-2">
												<div className="h-3 bg-[#1b1e2a] rounded w-1/3" />
												<div className="h-2 bg-[#1b1e2a] rounded w-1/2" />
											</div>
										</div>
										<div className="space-y-2">
											<div className="h-3 bg-[#1b1e2a] rounded w-full" />
											<div className="h-3 bg-[#1b1e2a] rounded w-5/6" />
										</div>
									</div>
								))}
							</div>
						) : error ? (
							<div className="text-center py-12 text-[#ef4444]">
								<p className="mb-3">{error}</p>
								<button
									onClick={loadFeed}
									className="px-4 py-2 bg-[#1b1e2a] hover:bg-[#22263a] rounded-lg text-sm text-[#d4d6e2] transition-colors">
									Retry
								</button>
							</div>
						) : posts.length === 0 ? (
							<div className="text-center py-16 text-[#595c73]">
								<p className="text-lg font-semibold mb-1">No posts yet</p>
								<p className="text-sm">Be the first to share something with your campus!</p>
							</div>
						) : (
							<div className="flex flex-col gap-5">
								{posts.map((post) => (
									<PostCard
										key={post.id}
										post={post}
										currentUser={currentUser}
										onPostUpdated={handlePostUpdated}
									/>
								))}
							</div>
						)}
					</div>

					{/* Right Sidebar Widgets */}
					<div className="hidden lg:flex flex-col gap-6 w-80 shrink-0 sticky top-24 self-start">
						{/* Upcoming Events */}
						<UpcomingEvents
							onSeeAll={() => onNavigateTab && onNavigateTab("Events")}
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
