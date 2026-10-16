import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import PostCard from "../components/feed/PostCard";
import NoteCard from "../components/notes/NoteCard";
import CommunityCard from "../components/communities/CommunityCard";
import EventCard from "../components/events/EventCard";
import { getMyProfile, updateProfile } from "../services/userService";

import hackathonImg from "../assets/hackathon.jpg";
import roboticsImg from "../assets/robotics.jpg";
import cameraImg from "../assets/camera.jpg";

const DEFAULT_ACHIEVEMENTS = [
	{
		id: 1,
		title: "Active Student",
		style: "bg-[#251e12] text-[#f59e0b] border-[#483719]",
		icon: (
			<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
			</svg>
		),
	},
	{
		id: 2,
		title: "Top Contributor",
		style: "bg-[#241747] text-[#a78bfa] border-[#3e2b70]",
		icon: (
			<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
			</svg>
		),
	},
	{
		id: 3,
		title: "Campus Pioneer",
		style: "bg-[#112a1f] text-[#4ade80] border-[#1a5338]",
		icon: (
			<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
			</svg>
		),
	},
];

const PROFILE_POSTS = [
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
];

const PROFILE_NOTES = [
	{
		id: 1,
		code: "CS301",
		title: "Data Structures & Algorithms — Complete Guide",
		department: "Computer Science",
		semester: "5th Sem",
		author: {
			name: "Alex Chen",
			avatarText: "A",
			avatarBg: "bg-[#06b6d4]",
		},
		date: "Sep 2, 2025",
		rating: "4.8",
		downloads: 342,
		pages: 48,
	},
];

const PROFILE_COMMUNITIES = [
	{
		id: 1,
		name: "Coding Club",
		members: "1,247 members",
		category: "Technology",
		description: "Weekly coding challenges, hackathon prep, and open-source projects.",
		image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
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
		description: "Exploring machine learning, computer vision, and autonomous systems.",
		image: roboticsImg,
		isJoined: true,
		icon: (
			<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
			</svg>
		),
	},
];

const PROFILE_EVENTS = [
	{
		id: 1,
		title: "HackMIT 2025",
		category: "Hackathon",
		date: "Sep 12–13, 2025",
		time: "9:00 AM",
		location: "Main Auditorium",
		attendeesCount: 342,
		isRegistered: true,
		status: "upcoming",
		image: hackathonImg,
	},
	{
		id: 4,
		title: "Photography Exhibition",
		category: "Cultural",
		date: "Sep 20–22, 2025",
		time: "11:00 AM",
		location: "Art Gallery",
		attendeesCount: 450,
		isRegistered: true,
		status: "upcoming",
		image: cameraImg,
	},
];

const TABS = ["Posts", "Notes", "Communities", "Events"];

const ProfilePage = ({ onNavigateTab, currentUser, onUserUpdated }) => {
	const [activeSubTab, setActiveSubTab] = useState("Posts");
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	// Profile state initialized with currentUser or fallbacks
	const [profile, setProfile] = useState(() => ({
		name: currentUser?.name || "Student",
		email: currentUser?.email || "",
		department: currentUser?.department || "Computer Science",
		yearOfStudy: currentUser?.yearOfStudy || 1,
		university: currentUser?.university || "Campus University",
		bio: currentUser?.bio || "Learning and building together on CampusConnect.",
		skills: currentUser?.skills && currentUser.skills.length > 0 ? currentUser.skills : ["React", "Java", "Python"],
		interests: currentUser?.interests || [],
		stats: {
			posts: "12",
			followers: "128",
			following: "84",
			notes: "5",
		},
	}));

	// Form editing state
	const [editForm, setEditForm] = useState({
		name: profile.name,
		bio: profile.bio,
		university: profile.university,
		department: profile.department,
		yearOfStudy: profile.yearOfStudy,
		skillsText: profile.skills.join(", "),
	});

	// Fetch live profile from backend on mount
	useEffect(() => {
		let isMounted = true;
		getMyProfile()
			.then((data) => {
				if (isMounted && data) {
					setProfile((prev) => ({
						...prev,
						...data,
						stats: prev.stats,
					}));
					setEditForm({
						name: data.name || "",
						bio: data.bio || "",
						university: data.university || "Campus University",
						department: data.department || "Computer Science",
						yearOfStudy: data.yearOfStudy || 1,
						skillsText: (data.skills || []).join(", "),
					});
				}
			})
			.catch((err) => {
				console.warn("Could not load backend profile:", err.message);
			});
		return () => {
			isMounted = false;
		};
	}, []);

	const handleOpenEdit = () => {
		setEditForm({
			name: profile.name || "",
			bio: profile.bio || "",
			university: profile.university || "Campus University",
			department: profile.department || "Computer Science",
			yearOfStudy: profile.yearOfStudy || 1,
			skillsText: (profile.skills || []).join(", "),
		});
		setErrorMsg("");
		setSaveSuccess(false);
		setIsEditing(true);
	};

	const handleSaveProfile = async (e) => {
		e.preventDefault();
		setIsSaving(true);
		setErrorMsg("");

		const skillsArray = editForm.skillsText
			? editForm.skillsText.split(",").map((s) => s.trim()).filter(Boolean)
			: [];

		const payload = {
			name: editForm.name.trim(),
			bio: editForm.bio.trim(),
			university: editForm.university.trim(),
			department: editForm.department.trim(),
			yearOfStudy: parseInt(editForm.yearOfStudy, 10) || 1,
			skills: skillsArray,
		};

		try {
			const updated = await updateProfile(payload);
			setProfile((prev) => ({ ...prev, ...updated, stats: prev.stats }));
			if (onUserUpdated) onUserUpdated(updated);
			setSaveSuccess(true);
			setTimeout(() => {
				setIsEditing(false);
				setSaveSuccess(false);
			}, 900);
		} catch (err) {
			setErrorMsg(err.message || "Failed to save profile. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const avatarLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "U";
	const formattedYear = profile.yearOfStudy
		? `${profile.yearOfStudy}${
				profile.yearOfStudy === 1
					? "st"
					: profile.yearOfStudy === 2
					? "nd"
					: profile.yearOfStudy === 3
					? "rd"
					: "th"
		  } Year`
		: "Student";

	return (
		<div className="min-h-screen bg-[#07080b] text-white flex">
			{/* Left Main Navigation Sidebar */}
			<Sidebar activeTab="Profile" onSelectTab={onNavigateTab} />

			{/* Main Scrollable Area */}
			<div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
				{/* Top Full-width Purple Banner */}
				<div className="w-full h-44 sm:h-52 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] shrink-0" />

				{/* Profile Container */}
				<main className="px-6 sm:px-10 pb-12 flex flex-col gap-6 max-w-5xl">
					{/* Avatar + Action Buttons Row */}
					<div className="flex items-end justify-between -mt-16 sm:-mt-20">
						{/* Avatar */}
						<div className="relative">
							<div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#9333ea] to-[#c084fc] ring-4 ring-[#07080b] flex items-center justify-center text-4xl sm:text-5xl font-bold text-white shadow-2xl select-none">
								{avatarLetter}
							</div>
						</div>

						{/* Top Right Action Buttons: Edit Profile & Share */}
						<div className="flex items-center gap-2.5">
							<button
								type="button"
								onClick={handleOpenEdit}
								className="px-4 py-2.5 rounded-xl bg-[#141622] hover:bg-[#1c1f2e] border border-[#202334] text-xs font-semibold text-white flex items-center gap-2 shadow-sm transition-colors cursor-pointer">
								<svg
									className="w-3.5 h-3.5 text-[#8b8da4]"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
								<span>Edit Profile</span>
							</button>
						</div>
					</div>

					{/* Profile Header Details */}
					<div className="flex flex-col gap-3">
						<div>
							<h1 className="text-2xl font-bold text-white tracking-tight">
								{profile.name}
							</h1>
							<p className="text-xs text-[#8b8da4] mt-0.5">
								{profile.department} · {formattedYear} · {profile.university}
							</p>
						</div>

						{/* Bio */}
						<p className="text-xs sm:text-sm text-[#d4d6e2] leading-relaxed max-w-2xl">
							{profile.bio}
						</p>

						{/* Skills Pills */}
						<div className="flex flex-wrap gap-2 pt-1">
							{profile.skills &&
								profile.skills.map((skill, idx) => {
									const skillName = typeof skill === "object" ? skill.name : skill;
									return (
										<span
											key={idx}
											className="px-3 py-1 rounded-md text-xs font-semibold border bg-[#241747] text-[#c4b5fd] border-[#3e2b70]">
											{skillName}
										</span>
									);
								})}
						</div>

						{/* Email badge */}
						<div className="flex items-center gap-2 text-xs text-[#8b8da4] pt-1">
							<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
							<span>{profile.email}</span>
						</div>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
						<div className="p-4 rounded-2xl bg-[#0d0f15] border border-[#1b1e2a] flex flex-col items-center justify-center text-center gap-1 shadow-sm">
							<span className="text-xl sm:text-2xl font-bold text-[#c4b5fd]">
								{profile.stats?.posts || "0"}
							</span>
							<span className="text-xs text-[#71748d]">Posts</span>
						</div>

						<div className="p-4 rounded-2xl bg-[#0d0f15] border border-[#1b1e2a] flex flex-col items-center justify-center text-center gap-1 shadow-sm">
							<span className="text-xl sm:text-2xl font-bold text-[#c4b5fd]">
								{profile.stats?.followers || "0"}
							</span>
							<span className="text-xs text-[#71748d]">Followers</span>
						</div>

						<div className="p-4 rounded-2xl bg-[#0d0f15] border border-[#1b1e2a] flex flex-col items-center justify-center text-center gap-1 shadow-sm">
							<span className="text-xl sm:text-2xl font-bold text-[#c4b5fd]">
								{profile.stats?.following || "0"}
							</span>
							<span className="text-xs text-[#71748d]">Following</span>
						</div>

						<div className="p-4 rounded-2xl bg-[#0d0f15] border border-[#1b1e2a] flex flex-col items-center justify-center text-center gap-1 shadow-sm">
							<span className="text-xl sm:text-2xl font-bold text-[#c4b5fd]">
								{profile.stats?.notes || "0"}
							</span>
							<span className="text-xs text-[#71748d]">Notes</span>
						</div>
					</div>

					{/* Achievements Section */}
					<div className="flex flex-col gap-3">
						<h3 className="text-sm font-bold text-white tracking-tight">Achievements</h3>
						<div className="flex flex-wrap gap-2.5">
							{DEFAULT_ACHIEVEMENTS.map((ach) => (
								<div
									key={ach.id}
									className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border ${ach.style} shadow-sm select-none`}>
									{ach.icon}
									<span>{ach.title}</span>
								</div>
							))}
						</div>
					</div>

					{/* Tab Navigation: Posts, Notes, Communities, Events */}
					<div className="flex items-center gap-2 pt-2 select-none">
						{TABS.map((tab) => {
							const isActive = activeSubTab === tab;
							return (
								<button
									key={tab}
									type="button"
									onClick={() => setActiveSubTab(tab)}
									className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
										isActive
											? "bg-[#7c3aed] text-white shadow-md shadow-purple-900/40"
											: "bg-[#141520] text-[#9ca3af] border border-[#202230] hover:text-white hover:bg-[#1c1e2d]"
									}`}>
									{tab}
								</button>
							);
						})}
					</div>

					{/* Tab Content Panel */}
					<div className="flex flex-col gap-4">
						{activeSubTab === "Posts" && (
							<div className="flex flex-col gap-4">
								{PROFILE_POSTS.map((post) => (
									<PostCard key={post.id} post={post} />
								))}
							</div>
						)}

						{activeSubTab === "Notes" && (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{PROFILE_NOTES.map((note) => (
									<NoteCard key={note.id} note={note} />
								))}
							</div>
						)}

						{activeSubTab === "Communities" && (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{PROFILE_COMMUNITIES.map((comm) => (
									<CommunityCard key={comm.id} community={comm} onToggleJoin={() => {}} />
								))}
							</div>
						)}

						{activeSubTab === "Events" && (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{PROFILE_EVENTS.map((event) => (
									<EventCard key={event.id} event={event} onToggleRegister={() => {}} />
								))}
							</div>
						)}
					</div>

					{/* Edit Profile Modal */}
					{isEditing && (
						<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
							<div className="w-full max-w-lg bg-[#0e1017] border border-[#212435] rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
								<div className="flex items-center justify-between border-b border-[#181a26] pb-3">
									<h3 className="text-base font-bold text-white">Edit Profile</h3>
									<button
										type="button"
										onClick={() => setIsEditing(false)}
										className="text-[#71748d] hover:text-white cursor-pointer">
										✕
									</button>
								</div>

								{errorMsg && (
									<div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
										{errorMsg}
									</div>
								)}

								{saveSuccess && (
									<div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs">
										Profile updated successfully!
									</div>
								)}

								<form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-semibold text-[#8b8da4]">Full Name</label>
										<input
											type="text"
											required
											value={editForm.name}
											onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
											className="bg-[#141622] border border-[#23263a] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#7c3aed]"
										/>
									</div>

									<div className="grid grid-cols-2 gap-3">
										<div className="flex flex-col gap-1.5">
											<label className="text-xs font-semibold text-[#8b8da4]">University</label>
											<input
												type="text"
												value={editForm.university}
												onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
												className="bg-[#141622] border border-[#23263a] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#7c3aed]"
											/>
										</div>
										<div className="flex flex-col gap-1.5">
											<label className="text-xs font-semibold text-[#8b8da4]">Department</label>
											<input
												type="text"
												value={editForm.department}
												onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
												className="bg-[#141622] border border-[#23263a] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#7c3aed]"
											/>
										</div>
									</div>

									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-semibold text-[#8b8da4]">Year of Study</label>
										<select
											value={editForm.yearOfStudy}
											onChange={(e) => setEditForm({ ...editForm, yearOfStudy: e.target.value })}
											className="bg-[#141622] border border-[#23263a] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#7c3aed]">
											<option value="1">1st Year</option>
											<option value="2">2nd Year</option>
											<option value="3">3rd Year</option>
											<option value="4">4th Year</option>
											<option value="5">5th Year / Graduate</option>
										</select>
									</div>

									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-semibold text-[#8b8da4]">
											Skills (comma separated)
										</label>
										<input
											type="text"
											placeholder="e.g. React, Java, Machine Learning"
											value={editForm.skillsText}
											onChange={(e) => setEditForm({ ...editForm, skillsText: e.target.value })}
											className="bg-[#141622] border border-[#23263a] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#7c3aed]"
										/>
									</div>

									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-semibold text-[#8b8da4]">Bio</label>
										<textarea
											rows={3}
											value={editForm.bio}
											onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
											className="bg-[#141622] border border-[#23263a] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#7c3aed] resize-none"
										/>
									</div>

									<div className="flex items-center justify-end gap-2.5 pt-2">
										<button
											type="button"
											onClick={() => setIsEditing(false)}
											disabled={isSaving}
											className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b8da4] hover:text-white cursor-pointer">
											Cancel
										</button>
										<button
											type="submit"
											disabled={isSaving}
											className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white disabled:opacity-50 cursor-pointer flex items-center gap-2">
											{isSaving && (
												<div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											)}
											<span>{isSaving ? "Saving..." : "Save Changes"}</span>
										</button>
									</div>
								</form>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default ProfilePage;
