import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import CommunitiesPage from "./pages/CommunitiesPage";
import NotesPage from "./pages/NotesPage";
import EventsPage from "./pages/EventsPage";
import MessagesPage from "./pages/MessagesPage";

function App() {
	const [activeTab, setActiveTab] = useState("Messages");

	const handleNavigateTab = (tab) => {
		setActiveTab(tab);
	};

	if (activeTab === "Communities") {
		return <CommunitiesPage onNavigateTab={handleNavigateTab} />;
	}

	if (activeTab === "Notes") {
		return <NotesPage onNavigateTab={handleNavigateTab} />;
	}

	if (activeTab === "Events") {
		return <EventsPage onNavigateTab={handleNavigateTab} />;
	}

	if (activeTab === "Messages") {
		return <MessagesPage onNavigateTab={handleNavigateTab} />;
	}

	return <HomePage onNavigateTab={handleNavigateTab} />;
}

export default App;

