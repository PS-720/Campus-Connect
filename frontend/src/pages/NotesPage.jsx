import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import NoteCard from "../components/notes/NoteCard";
import UploadNotesModal from "../components/notes/UploadNotesModal";
import { getNotes, downloadNote } from "../services/noteService";

const DEPARTMENTS = [
	"All",
	"Computer Science",
	"Electronics",
	"Mathematics",
	"Mechanical",
	"Business",
];

const NotesPage = ({ onNavigateTab }) => {
	const [notes, setNotes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedDept, setSelectedDept] = useState("All");
	const [isUploadOpen, setIsUploadOpen] = useState(false);

	const fetchNotes = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const params = {};
			if (selectedDept && selectedDept !== "All") {
				params.department = selectedDept;
			}
			if (searchQuery.trim()) {
				params.search = searchQuery.trim();
			}
			const data = await getNotes(params);
			setNotes(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error("Failed to load notes:", err);
			setError(err.message || "Failed to load notes. Please try again.");
		} finally {
			setLoading(false);
		}
	}, [selectedDept, searchQuery]);

	useEffect(() => {
		fetchNotes();
	}, [fetchNotes]);

	const handleAddNote = (newNote) => {
		setNotes((prev) => [newNote, ...prev]);
	};

	const handleDownload = async (note) => {
		try {
			const response = await downloadNote(note.id);
			const blob = new Blob([response.data || response]);
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `${note.title || "notes"}.txt`);
			document.body.appendChild(link);
			link.click();
			link.parentNode.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (err) {
			console.error("Download failed:", err);
		}
	};

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

					{/* Error state */}
					{error && (
						<div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs sm:text-sm">
							<span>{error}</span>
							<button
								onClick={fetchNotes}
								className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 font-medium transition-colors cursor-pointer">
								Retry
							</button>
						</div>
					)}

					{/* Loading Skeletons */}
					{loading && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{[...Array(8)].map((_, i) => (
								<div
									key={i}
									className="flex flex-col bg-[#0d0f15] border border-[#1b1e2a] rounded-2xl p-5 justify-between gap-5 animate-pulse min-h-[220px]">
									<div className="flex flex-col gap-3.5">
										<div className="flex items-center justify-between">
											<div className="w-10 h-10 rounded-xl bg-[#181b28]" />
											<div className="w-14 h-5 rounded-md bg-[#181b28]" />
										</div>
										<div className="h-4 bg-[#181b28] rounded w-4/5" />
										<div className="h-3 bg-[#181b28] rounded w-2/5" />
									</div>
									<div className="pt-3 border-t border-[#181a26] flex flex-col gap-3">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div className="w-6 h-6 rounded-full bg-[#181b28]" />
												<div className="w-16 h-3 bg-[#181b28] rounded" />
											</div>
											<div className="w-12 h-3 bg-[#181b28] rounded" />
										</div>
										<div className="flex items-center justify-between pt-1">
											<div className="w-24 h-3 bg-[#181b28] rounded" />
											<div className="w-16 h-3 bg-[#181b28] rounded" />
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Empty State */}
					{!loading && !error && notes.length === 0 && (
						<div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-[#1e2235] rounded-3xl bg-[#0c0e14]/50">
							<div className="w-14 h-14 rounded-2xl bg-[#151824] border border-[#23273c] flex items-center justify-center text-[#7c3aed] mb-4">
								<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
							</div>
							<h3 className="text-base font-semibold text-white mb-1">No notes found</h3>
							<p className="text-xs text-[#6e728c] max-w-sm mb-5">
								{searchQuery || selectedDept !== "All"
									? "Try adjusting your search query or department filter."
									: "Be the first student to upload and share study materials for your peers!"}
							</p>
							<button
								type="button"
								onClick={() => setIsUploadOpen(true)}
								className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-all cursor-pointer">
								Upload Note
							</button>
						</div>
					)}

					{/* Notes Grid */}
					{!loading && !error && notes.length > 0 && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{notes.map((note) => (
								<NoteCard
									key={note.id}
									note={note}
									onDownload={handleDownload}
								/>
							))}
						</div>
					)}
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
