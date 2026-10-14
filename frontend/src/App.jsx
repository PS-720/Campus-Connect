import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import CommunitiesPage from "./pages/CommunitiesPage";
import NotesPage from "./pages/NotesPage";
import EventsPage from "./pages/EventsPage";
import MessagesPage from "./pages/MessagesPage";
import AIStudyPage from "./pages/AIStudyPage";

function App() {
	const [activeTab, setActiveTab] = useState("AI Study");

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

	if (activeTab === "AI Study") {
		return <AIStudyPage onNavigateTab={handleNavigateTab} />;
	}

	return <HomePage onNavigateTab={handleNavigateTab} />;
}

export default App;

