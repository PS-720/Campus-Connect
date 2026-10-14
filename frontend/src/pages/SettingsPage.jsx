import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ToggleSwitch from "../components/settings/ToggleSwitch";

const SettingsPage = ({ onNavigateTab, onLogout }) => {
	// Profile info state
	const [fullName, setFullName] = useState("Alex Chen");
	const [username, setUsername] = useState("@alexchen");
	const [collegeEmail, setCollegeEmail] = useState("alex@mit.edu");
	const [department, setDepartment] = useState("Computer Science");
	const [year, setYear] = useState("3rd Year");
	const [saveSuccess, setSaveSuccess] = useState(false);

	// Notification toggles state
	const [notifications, setNotifications] = useState({
		push: true,
		email: false,
		mentions: true,
		eventReminders: true,
		aiStudyTips: true,
	});

	// Privacy toggles state
	const [privacy, setPrivacy] = useState({
		publicProfile: true,
		onlineStatus: true,
		directMessages: true,
	});

	const handleSaveProfile = (e) => {
		e.preventDefault();
		setSaveSuccess(true);
		setTimeout(() => setSaveSuccess(false), 2000);
	};

	return (
		<div className="min-h-screen bg-[#07080b] text-white flex">
			{/* Left Main Navigation Sidebar */}
			<Sidebar activeTab="Settings" onSelectTab={onNavigateTab} />

			{/* Main Scrollable Content Area */}
			<div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
				{/* Top Header */}
				<Header
					title="Settings"
					subtitle="Manage your account and preferences"
					user={{ name: fullName, avatar: "A" }}
				/>

				{/* Settings Sections Container */}
				<main className="flex-1 px-6 sm:px-10 py-8 flex flex-col items-center">
					<div className="w-full max-w-2xl flex flex-col gap-6 pb-12">
						{/* Card 1: Profile Information */}
						<div className="rounded-3xl bg-[#0f1118]/90 border border-[#202334] p-7 sm:p-8 shadow-xl flex flex-col gap-6">
							<h3 className="text-base font-bold text-white tracking-tight">
								Profile Information
							</h3>

							{/* Avatar + Change Photo */}
							<div className="flex items-center gap-4">
								<div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#9333ea] to-[#c084fc] flex items-center justify-center text-xl font-bold text-white shadow-md select-none">
									A
								</div>

								<label className="px-4 py-2 rounded-xl bg-[#141622] hover:bg-[#1c1f2e] border border-[#222538] text-xs font-semibold text-white flex items-center gap-2 transition-colors cursor-pointer">
									<svg
										className="w-4 h-4 text-[#8b8da4]"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									<span>Change Photo</span>
									<input type="file" accept="image/*" className="hidden" />
								</label>
							</div>

							{/* Profile Form */}
							<form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
								{/* Row 1: Full Name & Username */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-semibold text-[#8b8da4]">
											Full Name
										</label>
										<input
											type="text"
											value={fullName}
											onChange={(e) => setFullName(e.target.value)}
											className="bg-[#12141e] border border-[#1e202d] focus:border-[#7c3aed] text-white text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-colors"
										/>
									</div>

									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-semibold text-[#8b8da4]">
											Username
										</label>
										<input
											type="text"
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											className="bg-[#12141e] border border-[#1e202d] focus:border-[#7c3aed] text-white text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-colors"
										/>
									</div>
								</div>

								{/* Row 2: College Email & Department */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-semibold text-[#8b8da4]">
											College Email
										</label>
										<input
											type="email"
											value={collegeEmail}
											onChange={(e) => setCollegeEmail(e.target.value)}
											className="bg-[#12141e] border border-[#1e202d] focus:border-[#7c3aed] text-white text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-colors"
										/>
									</div>

									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-semibold text-[#8b8da4]">
											Department
										</label>
										<input
											type="text"
											value={department}
											onChange={(e) => setDepartment(e.target.value)}
											className="bg-[#12141e] border border-[#1e202d] focus:border-[#7c3aed] text-white text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-colors"
										/>
									</div>
								</div>

								{/* Row 3: Year */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-semibold text-[#8b8da4]">
											Year
										</label>
										<input
											type="text"
											value={year}
											onChange={(e) => setYear(e.target.value)}
											className="bg-[#12141e] border border-[#1e202d] focus:border-[#7c3aed] text-white text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-colors"
										/>
									</div>
								</div>

								{/* Save Changes Button */}
								<div className="pt-2">
									<button
										type="submit"
										className="px-5 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold shadow-lg shadow-purple-900/40 transition-all cursor-pointer active:scale-[0.99] flex items-center gap-2">
										<span>{saveSuccess ? "Saved ✓" : "Save Changes"}</span>
									</button>
								</div>
							</form>
						</div>

						{/* Card 2: Notifications */}
						<div className="rounded-3xl bg-[#0f1118]/90 border border-[#202334] p-7 sm:p-8 shadow-xl flex flex-col gap-6">
							<h3 className="text-base font-bold text-white tracking-tight">
								Notifications
							</h3>

							<div className="flex flex-col gap-5">
								{/* Push Notifications */}
								<div className="flex items-center justify-between gap-4">
									<div>
										<h4 className="text-xs sm:text-sm font-semibold text-white">
											Push Notifications
										</h4>
										<p className="text-xs text-[#71748d]">
											Receive notifications on your device
										</p>
									</div>
									<ToggleSwitch
										checked={notifications.push}
										onChange={(val) =>
											setNotifications({ ...notifications, push: val })
										}
									/>
								</div>

								{/* Email Notifications */}
								<div className="flex items-center justify-between gap-4">
									<div>
										<h4 className="text-xs sm:text-sm font-semibold text-white">
											Email Notifications
										</h4>
										<p className="text-xs text-[#71748d]">
											Get updates sent to your email
										</p>
									</div>
									<ToggleSwitch
										checked={notifications.email}
										onChange={(val) =>
											setNotifications({ ...notifications, email: val })
										}
									/>
								</div>

								{/* Mentions & Replies */}
								<div className="flex items-center justify-between gap-4">
									<div>
										<h4 className="text-xs sm:text-sm font-semibold text-white">
											Mentions & Replies
										</h4>
										<p className="text-xs text-[#71748d]">
											When someone mentions or replies to you
										</p>
									</div>
									<ToggleSwitch
										checked={notifications.mentions}
										onChange={(val) =>
											setNotifications({ ...notifications, mentions: val })
										}
									/>
								</div>

								{/* Event Reminders */}
								<div className="flex items-center justify-between gap-4">
									<div>
										<h4 className="text-xs sm:text-sm font-semibold text-white">
											Event Reminders
										</h4>
										<p className="text-xs text-[#71748d]">
											Reminders for registered events
										</p>
									</div>
									<ToggleSwitch
										checked={notifications.eventReminders}
										onChange={(val) =>
											setNotifications({
												...notifications,
												eventReminders: val,
											})
										}
									/>
								</div>

								{/* AI Study Tips */}
								<div className="flex items-center justify-between gap-4">
									<div>
										<h4 className="text-xs sm:text-sm font-semibold text-white">
											AI Study Tips
										</h4>
										<p className="text-xs text-[#71748d]">
											Personalized study recommendations from AI
										</p>
									</div>
									<ToggleSwitch
										checked={notifications.aiStudyTips}
										onChange={(val) =>
											setNotifications({
												...notifications,
												aiStudyTips: val,
											})
										}
									/>
								</div>
							</div>
						</div>

						{/* Card 3: Privacy & Security */}
						<div className="rounded-3xl bg-[#0f1118]/90 border border-[#202334] p-7 sm:p-8 shadow-xl flex flex-col gap-6">
							<h3 className="text-base font-bold text-white tracking-tight">
								Privacy & Security
							</h3>

							<div className="flex flex-col gap-5">
								{/* Public Profile */}
								<div className="flex items-center justify-between gap-4">
									<div>
										<h4 className="text-xs sm:text-sm font-semibold text-white">
											Public Profile
										</h4>
										<p className="text-xs text-[#71748d]">
											Anyone on campus can see your profile
										</p>
									</div>
									<ToggleSwitch
										checked={privacy.publicProfile}
										onChange={(val) =>
											setPrivacy({ ...privacy, publicProfile: val })
										}
									/>
								</div>

								{/* Online Status */}
								<div className="flex items-center justify-between gap-4">
									<div>
										<h4 className="text-xs sm:text-sm font-semibold text-white">
											Online Status
										</h4>
										<p className="text-xs text-[#71748d]">
											Show when you're active on campus
										</p>
									</div>
									<ToggleSwitch
										checked={privacy.onlineStatus}
										onChange={(val) =>
											setPrivacy({ ...privacy, onlineStatus: val })
										}
									/>
								</div>

								{/* Direct Messages */}
								<div className="flex items-center justify-between gap-4">
									<div>
										<h4 className="text-xs sm:text-sm font-semibold text-white">
											Direct Messages
										</h4>
										<p className="text-xs text-[#71748d]">
											Allow other students to message you
										</p>
									</div>
									<ToggleSwitch
										checked={privacy.directMessages}
										onChange={(val) =>
											setPrivacy({ ...privacy, directMessages: val })
										}
									/>
								</div>
							</div>
						</div>

						{/* Card 4: Danger Zone */}
						<div className="rounded-3xl bg-[#120d12]/60 border border-[#3b1922] p-7 sm:p-8 shadow-xl flex flex-col gap-4">
							<h3 className="text-sm font-bold text-[#f87171] tracking-tight">
								Danger Zone
							</h3>

							<div className="flex flex-wrap items-center gap-3">
								{/* Sign Out Button */}
								<button
									type="button"
									onClick={onLogout}
									className="px-4 py-2.5 rounded-xl bg-[#1f1217] hover:bg-[#2b161f] border border-[#4d1f2b] text-xs font-semibold text-[#f87171] hover:text-[#fca5a5] flex items-center gap-2 transition-colors cursor-pointer">
									<svg
										className="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
										/>
									</svg>
									<span>Sign Out</span>
								</button>

								{/* Delete Account Button */}
								<button
									type="button"
									onClick={() => alert("Delete account requested")}
									className="px-4 py-2.5 rounded-xl bg-[#1f1217] hover:bg-[#2b161f] border border-[#4d1f2b] text-xs font-semibold text-[#f87171] hover:text-[#fca5a5] flex items-center gap-2 transition-colors cursor-pointer">
									<svg
										className="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
									<span>Delete Account</span>
								</button>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default SettingsPage;
