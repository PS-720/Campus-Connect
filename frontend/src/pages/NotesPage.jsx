import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import NoteCard from "../components/notes/NoteCard";
import UploadNotesModal from "../components/notes/UploadNotesModal";

const INITIAL_NOTES = [
	{
		id: 1,
		code: "CS301",
		title: "Data Structures & Algorithms — Complete Guide",
		department: "Computer Science",
		semester: "5th Sem",
		author: {
			name: "Dev Patel",
			avatarText: "D",
			avatarBg: "bg-[#10b981]",
		},
		date: "Sep 2, 2025",
		rating: "4.8",
		downloads: 342,
		pages: 48,
	},
	{
		id: 2,
		code: "EC402",
		title: "Digital Signal Processing — Lecture Notes",
		department: "Electronics",
		semester: "7th Sem",
		author: {
			name: "Priya Sharma",
			avatarText: "P",
			avatarBg: "bg-[#10b981]",
		},
		date: "Aug 28, 2025",
		rating: "4.6",
		downloads: 218,
		pages: 32,
	},
	{
		id: 3,
		code: "CS501",
		title: "Machine Learning Fundamentals",
		department: "Computer Science",
		semester: "6th Sem",
		author: {
			name: "Sara Liu",
			avatarText: "S",
			avatarBg: "bg-[#06b6d4]",
		},
		date: "Aug 25, 2025",
		rating: "4.9",
		downloads: 567,
		pages: 64,
	},
	{
		id: 4,
		code: "MA301",
		title: "Engineering Mathematics III",
		department: "Mathematics",
		semester: "5th Sem",
		author: {
			name: "Kenji Tanaka",
			avatarText: "K",
			avatarBg: "bg-[#f43f5e]",
		},
		date: "Aug 20, 2025",
		rating: "4.5",
		downloads: 445,
		pages: 56,
	},
	{
		id: 5,
		code: "ME402",
		title: "Thermodynamics & Heat Transfer",
		department: "Mechanical",
		semester: "7th Sem",
		author: {
			name: "Aisha Rahman",
			avatarText: "A",
			avatarBg: "bg-[#06b6d4]",
		},
		date: "Aug 18, 2025",
		rating: "4.7",
		downloads: 289,
		pages: 40,
	},
	{
		id: 6,
		code: "BU301",
		title: "Corporate Finance & Valuation",
		department: "Business",
		semester: "5th Sem",
		author: {
			name: "Marcus Johnson",
			avatarText: "M",
			avatarBg: "bg-[#06b6d4]",
		},
		date: "Aug 15, 2025",
		rating: "4.4",
		downloads: 198,
		pages: 36,
	},
];

const DEPARTMENTS = [
	"All",
	"Computer Science",
	"Electronics",
	"Mathematics",
	"Mechanical",
	"Business",
];

const NotesPage = ({ onNavigateTab }) => {
	const [notes, setNotes] = useState(INITIAL_NOTES);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedDept, setSelectedDept] = useState("All");
	const [isUploadOpen, setIsUploadOpen] = useState(false);

	const handleAddNote = (newNote) => {
		setNotes([newNote, ...notes]);
	};

	const filteredNotes = notes.filter((n) => {
		const matchesSearch =
			n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			n.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
			n.department.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesDept =
			selectedDept === "All" ||
			n.department.toLowerCase() === selectedDept.toLowerCase();

		return matchesSearch && matchesDept;
	});

	return (
		<div className="min-h-screen bg-[#07080b] text-white flex">
			{/* Left Fixed Sidebar */}
			<Sidebar activeTab="Notes" onSelectTab={onNavigateTab} />

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Top Header */}
				<Header
					title="Notes"
					subtitle="Academic resources shared by students"
					user={{ name: "Alex Chen", avatar: "A" }}
				/>

				{/* Page Content */}
				<main className="flex-1 px-6 sm:px-8 py-6 flex flex-col gap-6">
					{/* Toolbar: Search + Filter Dropdown + Upload Button */}
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
						{/* Search input */}
						<div className="relative flex-1">
							<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#52556d]">
								<svg
									className="w-4 h-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search notes, subjects..."
								className="w-full bg-[#0d0f15] border border-[#1b1e2a] focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#50536c] outline-none transition-colors"
							/>
						</div>

						{/* Department Filter Dropdown */}
						<div className="relative">
							<select
								value={selectedDept}
								onChange={(e) => setSelectedDept(e.target.value)}
								className="bg-[#0d0f15] border border-[#1b1e2a] focus:border-[#7c3aed] text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 pr-10 outline-none cursor-pointer appearance-none transition-colors">
								{DEPARTMENTS.map((dept) => (
									<option key={dept} value={dept} className="bg-[#0d0f15]">
										{dept}
									</option>
								))}
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#6b6e86]">
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</div>
						</div>

						{/* Upload Notes Button */}
						<button
							type="button"
							onClick={() => setIsUploadOpen(true)}
							className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-md shadow-purple-900/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer">
							<svg
								className="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
								/>
							</svg>
							<span>Upload Notes</span>
						</button>
					</div>

					{/* Notes Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredNotes.map((note) => (
							<NoteCard
								key={note.id}
								note={note}
								onDownload={(n) => console.log("Downloading note:", n.title)}
							/>
						))}
					</div>
				</main>
			</div>

			{/* Upload Modal */}
			<UploadNotesModal
				isOpen={isUploadOpen}
				onClose={() => setIsUploadOpen(false)}
				onUpload={handleAddNote}
			/>
		</div>
	);
};

export default NotesPage;
