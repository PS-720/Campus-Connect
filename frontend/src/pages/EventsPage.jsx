import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import EventTabs from "../components/events/EventTabs";
import EventCard from "../components/events/EventCard";

import hackathonImg from "../assets/hackathon.jpg";
import roboticsImg from "../assets/robotics.jpg";
import businessImg from "../assets/business.jpg";
import cameraImg from "../assets/camera.jpg";
import sportsImg from "../assets/sports.jpg";

const INITIAL_EVENTS = [
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
		id: 2,
		title: "AI Workshop Series: LLMs",
		category: "Workshop",
		date: "Sep 15, 2025",
		time: "2:00 PM",
		location: "CS Lab 204",
		attendeesCount: 80,
		isRegistered: false,
		status: "upcoming",
		image: roboticsImg,
	},
	{
		id: 3,
		title: "Annual Career Fair 2025",
		category: "Career",
		date: "Sep 18, 2025",
		time: "10:00 AM",
		location: "Campus Grounds",
		attendeesCount: 1200,
		isRegistered: true,
		status: "upcoming",
		image: businessImg,
	},
	{
		id: 4,
		title: "Photography Exhibition",
		category: "Cultural",
		date: "Sep 20–22, 2025",
		time: "11:00 AM",
		location: "Art Gallery",
		attendeesCount: 450,
		isRegistered: false,
		status: "upcoming",
		image: cameraImg,
	},
	{
		id: 5,
		title: "Inter-College Cricket Tournament",
		category: "Sports",
		date: "Sep 25, 2025",
		time: "8:00 AM",
		location: "Sports Complex",
		attendeesCount: 600,
		isRegistered: false,
		status: "upcoming",
		image: sportsImg,
	},
];

const EventsPage = ({ onNavigateTab }) => {
	const [events, setEvents] = useState(INITIAL_EVENTS);
	const [activeTab, setActiveTab] = useState("Upcoming");
	const [searchQuery, setSearchQuery] = useState("");

	const handleToggleRegister = (id) => {
		setEvents((prev) =>
			prev.map((ev) =>
				ev.id === id
					? {
							...ev,
							isRegistered: !ev.isRegistered,
							attendeesCount: ev.isRegistered
								? ev.attendeesCount - 1
								: ev.attendeesCount + 1,
					  }
					: ev
			)
		);
	};

	const filteredEvents = events.filter((ev) => {
		const matchesSearch =
			ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			ev.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
			ev.category.toLowerCase().includes(searchQuery.toLowerCase());

		if (!matchesSearch) return false;

		if (activeTab === "Registered") {
			return ev.isRegistered;
		}
		if (activeTab === "Past") {
			return ev.status === "past";
		}
		// "Upcoming"
		return ev.status === "upcoming";
	});

	return (
		<div className="min-h-screen bg-[#07080b] text-white flex">
			{/* Left Fixed Navigation Sidebar */}
			<Sidebar activeTab="Events" onSelectTab={onNavigateTab} />

			{/* Main Scrollable Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Header */}
				<Header
					title="Events"
					subtitle="Discover what's happening on campus"
					user={{ name: "Alex Chen", avatar: "A" }}
					searchValue={searchQuery}
					onSearch={setSearchQuery}
				/>

				{/* Page Body */}
				<main className="flex-1 px-6 sm:px-8 py-6 flex flex-col gap-6">
					{/* Filter Tabs Row */}
					<EventTabs
						activeTab={activeTab}
						onSelectTab={(tab) => setActiveTab(tab)}
					/>

					{/* Events Grid */}
					{filteredEvents.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredEvents.map((ev) => (
								<EventCard
									key={ev.id}
									event={ev}
									onToggleRegister={handleToggleRegister}
								/>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-20 text-center bg-[#0d0f15] border border-[#1b1e2a] rounded-2xl p-8">
							<div className="w-12 h-12 rounded-2xl bg-[#141622] border border-[#202334] flex items-center justify-center text-[#71748d] mb-3">
								<svg
									className="w-6 h-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.8}
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h3 className="text-sm font-semibold text-white">
								No events found
							</h3>
							<p className="text-xs text-[#71748d] mt-1 max-w-sm">
								{activeTab === "Registered"
									? "You haven't registered for any events yet. Check out the Upcoming tab to discover exciting campus activities!"
									: "No past events available right now."}
							</p>
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default EventsPage;
