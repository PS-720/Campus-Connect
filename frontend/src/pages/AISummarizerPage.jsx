import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const AISummarizerPage = ({ onNavigateTab }) => {
	const [uploadedFile, setUploadedFile] = useState(null);
	const [isSummarizing, setIsSummarizing] = useState(false);
	const [summaryResult, setSummaryResult] = useState(null);

	const handleFileSelect = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploadedFile(file);
		setIsSummarizing(true);

		// Mock summarization process
		setTimeout(() => {
			setIsSummarizing(false);
			setSummaryResult({
				fileName: file.name,
				overview:
					"This document covers the fundamental principles of Object-Oriented Programming and Data Structures. It emphasizes polymorphism, memory allocation, and algorithmic complexity for standard graph traversal routines.",
				keyConcepts: [
					{
						term: "Polymorphism & Dynamic Dispatch",
						desc: "Permits runtime invocation of overridden methods via virtual table resolution.",
					},
					{
						term: "Encapsulation & Access Modifiers",
						desc: "Protects class internal state from illegal external mutations.",
					},
					{
						term: "Time & Space Complexity",
						desc: "Evaluates upper bound runtime benchmarks across tree traversals.",
					},
				],
				examFocus: [
					"Differentiate compile-time vs runtime polymorphism with Java code snippets.",
					"Explain abstract class vs interface with memory layout implications.",
					"Solve complexity questions for recursive tree traversals.",
				],
			});
		}, 1500);
	};

	return (
		<div className="min-h-screen bg-[#07080b] text-white flex">
			{/* Left Fixed Navigation Sidebar */}
			<Sidebar activeTab="AI Summarizer" onSelectTab={onNavigateTab} />

			{/* Main Scrollable Content Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Top Header */}
				<Header
					title="AI Note Summarizer"
					subtitle="Upload your notes and let AI do the heavy lifting"
					user={{ name: "Alex Chen", avatar: "A" }}
				/>

				{/* Page Content */}
				<main className="flex-1 px-6 sm:px-8 py-8 flex flex-col items-center justify-center">
					<div className="w-full max-w-4xl flex flex-col gap-6">
						{/* Main Upload Box */}
						<div className="w-full rounded-3xl bg-[#0f1118]/80 border border-[#202334] p-10 sm:p-14 flex flex-col items-center justify-center text-center shadow-2xl shadow-black/60 relative overflow-hidden">
							{/* Soft background ambient gradient glow */}
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7c3aed]/10 blur-[100px] pointer-events-none rounded-full" />

							{/* Upload Icon Box */}
							<div className="w-16 h-16 rounded-2xl bg-[#804bdf] flex items-center justify-center shadow-xl shadow-purple-900/40 mb-6 shrink-0 transition-transform duration-200 hover:scale-105">
								<svg
									className="w-8 h-8 text-white"
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
							</div>

							{/* Title */}
							<h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
								Upload your PDF notes
							</h2>

							{/* Subtitle */}
							<p className="text-xs sm:text-sm text-[#8b8da4] max-w-lg mb-8 leading-relaxed">
								Drop any study material and our AI will generate a comprehensive summary
								with key concepts, definitions, and exam focus areas.
							</p>

							{/* Choose PDF File Button */}
							<label className="relative px-7 py-3 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold shadow-lg shadow-purple-900/40 flex items-center gap-2.5 transition-all duration-150 cursor-pointer active:scale-[0.98]">
								<svg
									className="w-4.5 h-4.5"
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
								<span>
									{isSummarizing
										? "Summarizing Notes..."
										: uploadedFile
										? "Choose Another PDF"
										: "Choose PDF File"}
								</span>
								<input
									type="file"
									accept=".pdf"
									onChange={handleFileSelect}
									className="hidden"
								/>
							</label>

							{/* Disclaimer / Support note */}
							<span className="text-[11px] text-[#595c73] mt-5">
								Supports PDF up to 100MB · Your notes stay private
							</span>
						</div>

						{/* 3 Feature Highlight Cards */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
							{/* Summary Card */}
							<div className="rounded-2xl bg-[#0f1118]/80 border border-[#1b1e2d] hover:border-[#2b2e42] p-6 flex flex-col items-center text-center gap-3 transition-all duration-150 shadow-md">
								<div className="w-10 h-10 rounded-xl bg-[#141624] border border-[#23263a] flex items-center justify-center text-[#a78bfa]">
									<svg
										className="w-5 h-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.8}
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
								<h3 className="text-sm font-bold text-white tracking-tight">
									Summary
								</h3>
								<p className="text-xs text-[#71748d]">
									Concise overview of all topics
								</p>
							</div>

							{/* Key Concepts Card */}
							<div className="rounded-2xl bg-[#0f1118]/80 border border-[#1b1e2d] hover:border-[#2b2e42] p-6 flex flex-col items-center text-center gap-3 transition-all duration-150 shadow-md">
								<div className="w-10 h-10 rounded-xl bg-[#141624] border border-[#23263a] flex items-center justify-center text-[#a78bfa]">
									<svg
										className="w-5 h-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.8}
											d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
										/>
									</svg>
								</div>
								<h3 className="text-sm font-bold text-white tracking-tight">
									Key Concepts
								</h3>
								<p className="text-xs text-[#71748d]">
									Important ideas extracted
								</p>
							</div>

							{/* Quiz Ready Card */}
							<div className="rounded-2xl bg-[#0f1118]/80 border border-[#1b1e2d] hover:border-[#2b2e42] p-6 flex flex-col items-center text-center gap-3 transition-all duration-150 shadow-md">
								<div className="w-10 h-10 rounded-xl bg-[#141624] border border-[#23263a] flex items-center justify-center text-[#a78bfa]">
									<svg
										className="w-5 h-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.8}
											d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
										/>
									</svg>
								</div>
								<h3 className="text-sm font-bold text-white tracking-tight">
									Quiz Ready
								</h3>
								<p className="text-xs text-[#71748d]">
									Generate practice questions
								</p>
							</div>
						</div>

						{/* Generated Summary View (Appears upon file upload) */}
						{summaryResult && (
							<div className="rounded-2xl bg-[#0d0f15] border border-[#1f2233] p-7 flex flex-col gap-5 mt-2 animate-fadeIn shadow-2xl">
								<div className="flex items-center justify-between border-b border-[#181a26] pb-4">
									<div className="flex items-center gap-3">
										<div className="w-9 h-9 rounded-xl bg-[#151726] border border-[#262940] flex items-center justify-center text-[#a78bfa]">
											<svg
												className="w-5 h-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1.8}
													d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
										</div>
										<div>
											<h4 className="text-sm font-bold text-white">
												{summaryResult.fileName}
											</h4>
											<span className="text-xs text-[#10b981] font-medium">
												Summary Ready
											</span>
										</div>
									</div>

									<button
										type="button"
										onClick={() => onNavigateTab && onNavigateTab("AI Quiz")}
										className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-md shadow-purple-900/30 transition-all cursor-pointer">
										Generate Quiz →
									</button>
								</div>

								{/* Overview */}
								<div>
									<h5 className="text-xs font-bold uppercase tracking-wider text-[#71748d] mb-2">
										Executive Overview
									</h5>
									<p className="text-xs sm:text-sm text-[#d4d6e2] leading-relaxed">
										{summaryResult.overview}
									</p>
								</div>

								{/* Key Concepts */}
								<div>
									<h5 className="text-xs font-bold uppercase tracking-wider text-[#71748d] mb-2">
										Key Concepts
									</h5>
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
										{summaryResult.keyConcepts.map((kc) => (
											<div
												key={kc.term}
												className="bg-[#12141e] border border-[#1e202d] rounded-xl p-3.5 flex flex-col gap-1">
												<span className="text-xs font-bold text-[#c4b5fd]">
													{kc.term}
												</span>
												<span className="text-[11px] text-[#8b8da4] leading-relaxed">
													{kc.desc}
												</span>
											</div>
										))}
									</div>
								</div>

								{/* Exam Focus Areas */}
								<div>
									<h5 className="text-xs font-bold uppercase tracking-wider text-[#71748d] mb-2">
										Exam Revision Focus
									</h5>
									<ul className="flex flex-col gap-2">
										{summaryResult.examFocus.map((point) => (
											<li
												key={point}
												className="flex items-center gap-2.5 text-xs text-[#9d9fb5]">
												<div className="w-4 h-4 rounded-full bg-[#1e1738] border border-[#3b2b68] flex items-center justify-center text-[#a78bfa] shrink-0 text-[10px]">
													✓
												</div>
												<span>{point}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
};

export default AISummarizerPage;
