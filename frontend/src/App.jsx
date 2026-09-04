import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import CommunitiesPage from "./pages/CommunitiesPage";
import NotesPage from "./pages/NotesPage";

function App() {
	const [activeTab, setActiveTab] = useState("Notes");

	const handleNavigateTab = (tab) => {
		setActiveTab(tab);
	};

	if (activeTab === "Communities") {
		return <CommunitiesPage onNavigateTab={handleNavigateTab} />;
	}

	if (activeTab === "Notes") {
		return <NotesPage onNavigateTab={handleNavigateTab} />;
	}

	return <HomePage onNavigateTab={handleNavigateTab} />;
}

export default App;

