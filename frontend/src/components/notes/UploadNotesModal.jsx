import React, { useState } from "react";
import { uploadNote } from "../../services/noteService";

const UploadNotesModal = ({ isOpen, onClose, onUpload }) => {
	const [title, setTitle] = useState("");
	const [code, setCode] = useState("");
	const [department, setDepartment] = useState("Computer Science");
	const [semester, setSemester] = useState("5th Sem");
	const [pages, setPages] = useState("");
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim() || !code.trim()) return;

		try {
			setIsSubmitting(true);
			setError(null);

			const formData = new FormData();
			formData.append("code", code.trim().toUpperCase());
			formData.append("title", title.trim());
			formData.append("department", department);
			formData.append("semester", semester);
			if (pages) formData.append("pages", pages);
			if (file) formData.append("file", file);

			const newNote = await uploadNote(formData);

			// Reset form
			setTitle("");
			setCode("");
			setDepartment("Computer Science");
			setSemester("5th Sem");
			setPages("");
			setFile(null);
			setFileName("");

			if (onUpload) {
				onUpload(newNote);
			}
			onClose();
		} catch (err) {
			console.error("Failed to upload note:", err);
			setError(err.message || "Failed to upload note. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
			<div className="w-full max-w-lg bg-[#0e1017] border border-[#212435] rounded-2xl p-6 shadow-2xl shadow-black/80 flex flex-col gap-5">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h3 className="text-base font-bold text-white tracking-tight">
						Upload Course Notes
					</h3>
					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="text-[#71748d] hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
						<svg
							className="w-5 h-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* Error message */}
				{error && (
					<div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
						{error}
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					{/* Course Code & Title */}
					<div className="grid grid-cols-3 gap-3">
						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-semibold text-[#8b8da4]">
								Course Code
							</label>
							<input
								type="text"
								placeholder="e.g. CS301"
								value={code}
								onChange={(e) => setCode(e.target.value)}
								required
								disabled={isSubmitting}
								className="bg-[#141622] border border-[#23263a] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#50536c] outline-none focus:border-[#7c3aed]"
							/>
						</div>
						<div className="col-span-2 flex flex-col gap-1.5">
							<label className="text-xs font-semibold text-[#8b8da4]">
								Note Title
							</label>
							<input
								type="text"
								placeholder="e.g. Algorithms Complete Guide"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
								disabled={isSubmitting}
								className="bg-[#141622] border border-[#23263a] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#50536c] outline-none focus:border-[#7c3aed]"
							/>
						</div>
					</div>

					{/* Department & Semester */}
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-semibold text-[#8b8da4]">
								Department
							</label>
							<select
								value={department}
								onChange={(e) => setDepartment(e.target.value)}
								disabled={isSubmitting}
								className="bg-[#141622] border border-[#23263a] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#7c3aed]">
								<option value="Computer Science">Computer Science</option>
								<option value="Electronics">Electronics</option>
								<option value="Mechanical">Mechanical</option>
								<option value="Mathematics">Mathematics</option>
								<option value="Business">Business</option>
							</select>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-semibold text-[#8b8da4]">
								Semester
							</label>
							<select
								value={semester}
								onChange={(e) => setSemester(e.target.value)}
								disabled={isSubmitting}
								className="bg-[#141622] border border-[#23263a] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#7c3aed]">
								<option value="1st Sem">1st Sem</option>
								<option value="2nd Sem">2nd Sem</option>
								<option value="3rd Sem">3rd Sem</option>
								<option value="4th Sem">4th Sem</option>
								<option value="5th Sem">5th Sem</option>
								<option value="6th Sem">6th Sem</option>
								<option value="7th Sem">7th Sem</option>
								<option value="8th Sem">8th Sem</option>
							</select>
						</div>
					</div>

					{/* File Upload Drop Area */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-[#8b8da4]">
							Document (PDF / DOCX)
						</label>
						<label className="border-2 border-dashed border-[#272b3f] hover:border-[#7c3aed] rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#12141e]/50 transition-colors">
							<svg
								className="w-7 h-7 text-[#7c3aed]"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.8}
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
							<span className="text-xs text-[#c4c6dc] font-medium">
								{fileName || "Click to browse or drop note file here"}
							</span>
							<span className="text-[10px] text-[#71748d]">
								PDF, DOC, PPT up to 50MB
							</span>
							<input
								type="file"
								className="hidden"
								disabled={isSubmitting}
								onChange={(e) => {
									if (e.target.files?.[0]) {
										setFile(e.target.files[0]);
										setFileName(e.target.files[0].name);
										if (!pages) setPages("24");
									}
								}}
							/>
						</label>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1a1c28]">
						<button
							type="button"
							onClick={onClose}
							disabled={isSubmitting}
							className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b8da4] hover:text-white hover:bg-[#181a26] transition-colors cursor-pointer">
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-md shadow-purple-900/40 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50">
							{isSubmitting && (
								<div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							)}
							<span>{isSubmitting ? "Uploading..." : "Upload & Share"}</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UploadNotesModal;
