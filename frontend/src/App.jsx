import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
	const [currentPage, setCurrentPage] = useState("login");

	return (
		<div className="bg-[#0a0b0e] min-h-screen text-white antialiased">
			{currentPage === "login" ? (
				<LoginPage
					onNavigateToRegister={() => setCurrentPage("register")}
					onLogin={(data) => console.log("Logged in:", data)}
				/>
			) : (
				<RegisterPage
					onNavigateToLogin={() => setCurrentPage("login")}
					onRegister={(data) => console.log("Registered:", data)}
				/>
			)}
		</div>
	);
}

export default App;

