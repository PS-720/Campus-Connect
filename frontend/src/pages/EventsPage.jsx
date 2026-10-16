import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import EventTabs from "../components/events/EventTabs";
import EventCard from "../components/events/EventCard";
import { getEvents, registerForEvent, unregisterFromEvent } from "../services/eventService";

import hackathonImg from "../assets/hackathon.jpg";
import roboticsImg from "../assets/robotics.jpg";
import businessImg from "../assets/business.jpg";
import cameraImg from "../assets/camera.jpg";
import sportsImg from "../assets/sports.jpg";

const IMAGE_MAP = {
	hackathon: hackathonImg,
	robotics: roboticsImg,
	business: businessImg,
	camera: cameraImg,
	sports: sportsImg,
};

const resolveEventImage = (img) => {
	if (!img) return hackathonImg;
	const key = img.toLowerCase();
	if (IMAGE_MAP[key]) return IMAGE_MAP[key];
	return img;
};

const EventsPage = ({ onNavigateTab }) => {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState("Upcoming");
	const [searchQuery, setSearchQuery] = useState("");

	const fetchEvents = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getEvents();
			const list = Array.isArray(data) ? data : [];
			const formatted = list.map((ev) => ({
				...ev,
				image: resolveEventImage(ev.image),
			}));
			setEvents(formatted);
		} catch (err) {
			console.error("Failed to load events:", err);
			setError(err.message || "Failed to load events. Please try again.");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchEvents();
	}, [fetchEvents]);

	const handleToggleRegister = async (id) => {
		const target = events.find((ev) => ev.id === id);
		if (!target) return;

		const willRegister = !target.isRegistered;

		// Optimistic UI update
		setEvents((prev) =>
			prev.map((ev) =>
				ev.id === id
					? {
							...ev,
							isRegistered: willRegister,
							attendeesCount: willRegister
								? ev.attendeesCount + 1
								: Math.max(0, ev.attendeesCount - 1),
					  }
					: ev
			)
		);

		try {
			if (willRegister) {
				const updated = await registerForEvent(id);
				if (updated) {
					setEvents((prev) =>
						prev.map((ev) =>
							ev.id === id
								? { ...ev, ...updated, image: resolveEventImage(updated.image) }
								: ev
						)
					);
				}
			} else {
				const updated = await unregisterFromEvent(id);
				if (updated) {
					setEvents((prev) =>
						prev.map((ev) =>
							ev.id === id
								? { ...ev, ...updated, image: resolveEventImage(updated.image) }
								: ev
						)
					);
				}
			}
		} catch (err) {
			console.error("Failed to toggle registration:", err);
			// Rollback on failure
			setEvents((prev) =>
				prev.map((ev) =>
					ev.id === id
						? {
								...ev,
								isRegistered: !willRegister,
								attendeesCount: !willRegister
									? ev.attendeesCount + 1
									: Math.max(0, ev.attendeesCount - 1),
						  }
						: ev
				)
			);
		}
	};

	const filteredEvents = events.filter((ev) => {
		const matchesSearch =
			(ev.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
			(ev.location || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
			(ev.category || "").toLowerCase().includes(searchQuery.toLowerCase());

		if (!matchesSearch) return false;

		if (activeTab === "Registered") {
			return ev.isRegistered;
		}
		if (activeTab === "Past") {
			return ev.status === "past";
		}
		// "Upcoming" (or default)
		return ev.status !== "past";
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

					{/* Error state */}
					{error && (
						<div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs sm:text-sm">
							<span>{error}</span>
							<button
								onClick={fetchEvents}
								className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 font-medium transition-colors cursor-pointer">
								Retry
							</button>
						</div>
					)}

					{/* Loading Skeletons */}
					{loading && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{[1, 2, 3, 4].map((n) => (
								<div
									key={n}
									className="flex flex-col bg-[#0d0f15] border border-[#1b1e2a] rounded-2xl overflow-hidden animate-pulse">
									<div className="w-full h-44 bg-[#161824]" />
									<div className="p-5 flex flex-col gap-3">
										<div className="h-4 bg-[#161824] rounded w-3/4" />
										<div className="h-3 bg-[#161824] rounded w-1/2" />
										<div className="h-3 bg-[#161824] rounded w-2/3" />
										<div className="h-9 bg-[#161824] rounded-xl mt-2" />
									</div>
								</div>
							))}
						</div>
					)}

					{/* Events Grid */}
					{!loading && !error && filteredEvents.length > 0 && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredEvents.map((ev) => (
								<EventCard
									key={ev.id}
									event={ev}
									onToggleRegister={handleToggleRegister}
								/>
							))}
						</div>
					)}

					{/* Empty State */}
					{!loading && !error && filteredEvents.length === 0 && (
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
									: "No events match your current filter or search criteria."}
							</p>
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default EventsPage;
