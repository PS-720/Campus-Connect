import React, { useState, useCallback } from "react";
import { isAuthenticated, getCachedUser, logout } from "./services/authService";

// Auth pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// App pages
import HomePage from "./pages/HomePage";
import CommunitiesPage from "./pages/CommunitiesPage";
import NotesPage from "./pages/NotesPage";
import EventsPage from "./pages/EventsPage";
import MessagesPage from "./pages/MessagesPage";
import AIStudyPage from "./pages/AIStudyPage";
import AISummarizerPage from "./pages/AISummarizerPage";
import AIQuizPage from "./pages/AIQuizPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

function App() {
	// Check for existing session on mount
	const [currentUser, setCurrentUser] = useState(() =>
		isAuthenticated() ? getCachedUser() : null
	);
	const [authView, setAuthView] = useState("login"); // "login" | "register"
	const [activeTab, setActiveTab] = useState("Home");

	const handleLoginSuccess = useCallback((user) => {
		setCurrentUser(user);
		setActiveTab("Home");
	}, []);

	const handleLogout = useCallback(() => {
		logout();
		setCurrentUser(null);
		setAuthView("login");
		setActiveTab("Home");
	}, []);

	const handleNavigateTab = useCallback((tab) => {
		setActiveTab(tab);
	}, []);

	// ── Auth guard ───────────────────────────────────────────────────────────────
	if (!currentUser) {
		if (authView === "register") {
			return (
				<RegisterPage
					onRegisterSuccess={handleLoginSuccess}
					onNavigateLogin={() => setAuthView("login")}
				/>
			);
		}
		return (
			<LoginPage
				onLoginSuccess={handleLoginSuccess}
				onNavigateRegister={() => setAuthView("register")}
			/>
		);
	}

	// ── Authenticated routes ─────────────────────────────────────────────────────
	const pageProps = { onNavigateTab: handleNavigateTab, currentUser };

	if (activeTab === "Communities") return <CommunitiesPage {...pageProps} />;
	if (activeTab === "Notes") return <NotesPage {...pageProps} />;
	if (activeTab === "Events") return <EventsPage {...pageProps} />;
	if (activeTab === "Messages") return <MessagesPage {...pageProps} />;
	if (activeTab === "AI Study") return <AIStudyPage {...pageProps} />;
	if (activeTab === "AI Summarizer") return <AISummarizerPage {...pageProps} />;
	if (activeTab === "AI Quiz") return <AIQuizPage {...pageProps} />;
	if (activeTab === "Notifications") return <NotificationsPage {...pageProps} />;
	if (activeTab === "Profile") return <ProfilePage {...pageProps} />;
	if (activeTab === "Settings") {
		return <SettingsPage {...pageProps} onLogout={handleLogout} />;
	}

	return <HomePage {...pageProps} />;
}

export default App;
