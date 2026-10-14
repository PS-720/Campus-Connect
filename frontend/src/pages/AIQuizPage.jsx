import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const SUBJECT_TOPICS = {
	"Computer Science": [
		"Data Structures",
		"Algorithms",
		"Object-Oriented Programming",
		"Operating Systems",
		"Database Management",
		"Computer Networks",
	],
	Electronics: [
		"Digital Signal Processing",
		"Microprocessors & Microcontrollers",
		"VLSI Design",
		"Analog Circuits",
	],
	Mathematics: [
		"Linear Algebra",
		"Calculus & Differential Equations",
		"Discrete Mathematics",
		"Probability & Statistics",
	],
	Mechanical: [
		"Thermodynamics",
		"Fluid Mechanics",
		"Heat Transfer",
		"Strength of Materials",
	],
	Business: [
		"Corporate Finance",
		"Marketing Management",
		"Organizational Behavior",
		"Financial Accounting",
	],
};

const SAMPLE_QUIZ_QUESTIONS = [
	{
		id: 1,
		question: "What is the worst-case time complexity of searching an element in a balanced Binary Search Tree (AVL Tree)?",
		options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
		correct: 1,
		explanation: "In an AVL tree, heights are balanced such that tree height remains logarithmic O(log n), guaranteeing worst-case search in O(log n).",
	},
	{
		id: 2,
		question: "Which of the following data structures operates on a Last-In, First-Out (LIFO) order?",
		options: ["Queue", "Stack", "Binary Heap", "Linked List"],
		correct: 1,
		explanation: "A Stack enforces the LIFO principle where the element added most recently is removed first.",
	},
	{
		id: 3,
		question: "What is the primary advantage of a Hash Table over a Binary Search Tree for basic search operations?",
		options: [
			"Guaranteed sorted order",
			"Average O(1) time complexity for lookup",
			"Zero memory overhead",
			"Simpler recursive implementations",
		],
		correct: 1,
		explanation: "Hash tables achieve average O(1) constant time lookups using direct index calculation through hash functions.",
	},
];

const AIQuizPage = ({ onNavigateTab }) => {
	const [subject, setSubject] = useState("Computer Science");
	const [topic, setTopic] = useState("Data Structures");
	const [difficulty, setDifficulty] = useState("Medium");
	const [questionType, setQuestionType] = useState("MCQ");
	const [questionCount, setQuestionCount] = useState(10);
	const [isGenerating, setIsGenerating] = useState(false);
	const [activeQuiz, setActiveQuiz] = useState(null);
	const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
	const [selectedAnswers, setSelectedAnswers] = useState({});
	const [showResults, setShowResults] = useState(false);

	const handleSubjectChange = (newSub) => {
		setSubject(newSub);
		const availableTopics = SUBJECT_TOPICS[newSub] || [];
		if (availableTopics.length > 0) {
			setTopic(availableTopics[0]);
		}
	};

	const handleGenerateQuiz = () => {
		setIsGenerating(true);
		setTimeout(() => {
			setIsGenerating(false);
			setActiveQuiz(SAMPLE_QUIZ_QUESTIONS);
			setCurrentQuestionIdx(0);
			setSelectedAnswers({});
			setShowResults(false);
		}, 1200);
	};

	const handleSelectAnswer = (qId, optionIdx) => {
		setSelectedAnswers((prev) => ({
			...prev,
			[qId]: optionIdx,
		}));
	};

	const calculateScore = () => {
		if (!activeQuiz) return 0;
		return activeQuiz.reduce((score, q) => {
			return selectedAnswers[q.id] === q.correct ? score + 1 : score;
		}, 0);
	};

	return (
		<div className="min-h-screen bg-[#07080b] text-white flex">
			{/* Left Main Navigation Sidebar */}
			<Sidebar activeTab="AI Quiz" onSelectTab={onNavigateTab} />

			{/* Main Scrollable Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Top Header */}
				<Header
					title="AI Quiz Generator"
					subtitle="Test your knowledge with AI-generated quizzes"
					user={{ name: "Alex Chen", avatar: "A" }}
				/>

				{/* Page Content */}
				<main className="flex-1 px-6 sm:px-8 py-8 flex flex-col items-center justify-center">
					{!activeQuiz ? (
						/* Configuration Card (Matching Screenshot) */
						<div className="w-full max-w-xl flex flex-col items-center">
							<div className="w-full rounded-3xl bg-[#0f1118]/90 border border-[#202334] p-8 sm:p-9 shadow-2xl shadow-black/80 flex flex-col gap-6">
								{/* Header */}
								<div className="flex items-center gap-3.5">
									<div className="w-11 h-11 rounded-xl bg-[#804bdf] flex items-center justify-center shadow-lg shadow-purple-900/30 shrink-0">
										<svg
											className="w-5 h-5 text-white"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
											/>
										</svg>
									</div>
									<div>
										<h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
											Configure Your Quiz
										</h2>
										<p className="text-xs text-[#71748d]">
											AI will generate tailored questions based on your settings
										</p>
									</div>
								</div>

								{/* Subject Dropdown */}
								<div className="flex flex-col gap-2">
									<label className="text-xs font-semibold text-[#8b8da4]">
										Subject
									</label>
									<div className="relative">
										<select
											value={subject}
											onChange={(e) => handleSubjectChange(e.target.value)}
											className="w-full bg-[#12141e] border border-[#1e202d] text-white text-xs sm:text-sm rounded-xl px-4 py-3 pr-10 appearance-none cursor-pointer outline-none focus:border-[#7c3aed] transition-colors">
											{Object.keys(SUBJECT_TOPICS).map((sub) => (
												<option key={sub} value={sub} className="bg-[#12141e]">
													{sub}
												</option>
											))}
										</select>
										<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#6b6e86]">
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
								</div>

								{/* Topic Dropdown */}
								<div className="flex flex-col gap-2">
									<label className="text-xs font-semibold text-[#8b8da4]">
										Topic
									</label>
									<div className="relative">
										<select
											value={topic}
											onChange={(e) => setTopic(e.target.value)}
											className="w-full bg-[#12141e] border border-[#1e202d] text-white text-xs sm:text-sm rounded-xl px-4 py-3 pr-10 appearance-none cursor-pointer outline-none focus:border-[#7c3aed] transition-colors">
											{(SUBJECT_TOPICS[subject] || []).map((t) => (
												<option key={t} value={t} className="bg-[#12141e]">
													{t}
												</option>
											))}
										</select>
										<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#6b6e86]">
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
								</div>

								{/* Difficulty Selector */}
								<div className="flex flex-col gap-2">
									<label className="text-xs font-semibold text-[#8b8da4]">
										Difficulty
									</label>
									<div className="grid grid-cols-3 gap-2.5">
										{["Easy", "Medium", "Hard"].map((lvl) => {
											const isSelected = difficulty === lvl;
											let activeClasses = "";
											if (isSelected) {
												if (lvl === "Easy") {
													activeClasses =
														"bg-[#13291d] text-[#4ade80] border-[#1d5939]";
												} else if (lvl === "Medium") {
													activeClasses =
														"bg-[#352511] text-[#fbbf24] border-[#6b4718]";
												} else {
													activeClasses =
														"bg-[#381616] text-[#f87171] border-[#6e2222]";
												}
											} else {
												activeClasses =
													"bg-[#12141e] text-[#71748d] border-[#1e202d] hover:text-[#c4c6dc]";
											}

											return (
												<button
													key={lvl}
													type="button"
													onClick={() => setDifficulty(lvl)}
													className={`py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${activeClasses}`}>
													{lvl}
												</button>
											);
										})}
									</div>
								</div>

								{/* Question Type Selector */}
								<div className="flex flex-col gap-2">
									<label className="text-xs font-semibold text-[#8b8da4]">
										Question Type
									</label>
									<div className="flex flex-wrap gap-2.5">
										{["MCQ", "True/False", "Short Answer"].map((type) => {
											const isSelected = questionType === type;
											return (
												<button
													key={type}
													type="button"
													onClick={() => setQuestionType(type)}
													className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
														isSelected
															? "bg-[#7c3aed] text-white shadow-md shadow-purple-900/30"
															: "bg-[#12141e] text-[#71748d] border border-[#1e202d] hover:text-[#c4c6dc]"
													}`}>
													{type}
												</button>
											);
										})}
									</div>
								</div>

								{/* Number of Questions Selector */}
								<div className="flex flex-col gap-2">
									<label className="text-xs font-semibold text-[#8b8da4]">
										Number of Questions
									</label>
									<div className="flex gap-2.5">
										{[5, 10, 15, 20].map((num) => {
											const isSelected = questionCount === num;
											return (
												<button
													key={num}
													type="button"
													onClick={() => setQuestionCount(num)}
													className={`w-12 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
														isSelected
															? "bg-[#251842] text-[#c4b5fd] border border-[#4c3780]"
															: "bg-[#12141e] text-[#71748d] border border-[#1e202d] hover:text-[#c4c6dc]"
													}`}>
													{num}
												</button>
											);
										})}
									</div>
								</div>

								{/* Generate Button */}
								<button
									type="button"
									onClick={handleGenerateQuiz}
									disabled={isGenerating}
									className="w-full py-3.5 px-4 mt-2 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-xl shadow-purple-900/40 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer">
									{isGenerating ? (
										<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									) : (
										<>
											<svg
												className="w-4.5 h-4.5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
												/>
											</svg>
											<span>Generate Quiz with AI</span>
										</>
									)}
								</button>
							</div>

							{/* Generation helper text */}
							<span className="text-xs text-[#595c73] mt-4 select-none">
								Quiz will be generated in seconds · {questionCount} questions on {topic}
							</span>
						</div>
					) : (
						/* Interactive Active Quiz Mode */
						<div className="w-full max-w-2xl flex flex-col gap-6 animate-fadeIn">
							<div className="rounded-3xl bg-[#0f1118]/95 border border-[#202334] p-8 shadow-2xl flex flex-col gap-6">
								{/* Quiz Header Bar */}
								<div className="flex items-center justify-between border-b border-[#181a26] pb-4">
									<div>
										<span className="text-[11px] font-bold uppercase tracking-wider text-[#a78bfa]">
											{subject} · {topic}
										</span>
										<h3 className="text-base font-bold text-white tracking-tight mt-0.5">
											Question {currentQuestionIdx + 1} of {activeQuiz.length}
										</h3>
									</div>

									<button
										type="button"
										onClick={() => setActiveQuiz(null)}
										className="text-xs text-[#71748d] hover:text-white px-3 py-1.5 rounded-lg border border-[#1e202d] hover:border-[#303348] transition-colors cursor-pointer">
										Exit Quiz
									</button>
								</div>

								{/* Question & Options */}
								{!showResults ? (
									<div className="flex flex-col gap-5">
										<p className="text-sm sm:text-base font-medium text-white leading-relaxed">
											{activeQuiz[currentQuestionIdx].question}
										</p>

										<div className="flex flex-col gap-3">
											{activeQuiz[currentQuestionIdx].options.map((option, optIdx) => {
												const qId = activeQuiz[currentQuestionIdx].id;
												const isSelected = selectedAnswers[qId] === optIdx;

												return (
													<button
														key={option}
														type="button"
														onClick={() => handleSelectAnswer(qId, optIdx)}
														className={`w-full flex items-center justify-between p-4 rounded-xl text-xs sm:text-sm font-medium border text-left transition-all cursor-pointer ${
															isSelected
																? "bg-[#251842] text-[#c4b5fd] border-[#7c3aed] shadow-md shadow-purple-950/40"
																: "bg-[#12141e] text-[#d4d6e2] border-[#1e202d] hover:border-[#303348]"
														}`}>
														<span>{option}</span>
														<div
															className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
																isSelected
																	? "border-[#7c3aed] bg-[#7c3aed]"
																	: "border-[#303348]"
															}`}>
															{isSelected && (
																<div className="w-1.5 h-1.5 rounded-full bg-white" />
															)}
														</div>
													</button>
												);
											})}
										</div>

										{/* Quiz Navigation Buttons */}
										<div className="flex items-center justify-between pt-4 border-t border-[#181a26]">
											<button
												type="button"
												disabled={currentQuestionIdx === 0}
												onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
												className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b8da4] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed">
												Previous
											</button>

											{currentQuestionIdx < activeQuiz.length - 1 ? (
												<button
													type="button"
													onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
													className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-md shadow-purple-900/30 cursor-pointer">
													Next Question
												</button>
											) : (
												<button
													type="button"
													onClick={() => setShowResults(true)}
													className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#10b981] hover:bg-[#059669] text-white shadow-md shadow-emerald-900/30 cursor-pointer">
													Submit & See Score
												</button>
											)}
										</div>
									</div>
								) : (
									/* Results View */
									<div className="flex flex-col gap-6 text-center">
										<div className="py-6 flex flex-col items-center">
											<div className="w-16 h-16 rounded-full bg-[#1e1738] border border-[#3b2b68] flex items-center justify-center text-2xl font-bold text-[#c4b5fd] mb-3">
												{calculateScore()} / {activeQuiz.length}
											</div>
											<h4 className="text-lg font-bold text-white">
												Quiz Completed!
											</h4>
											<p className="text-xs text-[#71748d] mt-1">
												Great job testing your knowledge on {topic}.
											</p>
										</div>

										{/* Explanations list */}
										<div className="flex flex-col gap-3 text-left">
											<span className="text-xs font-bold uppercase tracking-wider text-[#71748d]">
												Review & Explanations
											</span>
											{activeQuiz.map((q, idx) => {
												const userAns = selectedAnswers[q.id];
												const isCorrect = userAns === q.correct;
												return (
													<div
														key={q.id}
														className="bg-[#12141e] border border-[#1e202d] rounded-xl p-4 flex flex-col gap-2">
														<span className="text-xs font-bold text-white">
															{idx + 1}. {q.question}
														</span>
														<div className="text-xs flex items-center gap-2">
															<span
																className={`font-semibold ${
																	isCorrect ? "text-[#10b981]" : "text-[#ef4444]"
																}`}>
																Your answer: {q.options[userAns] || "Not answered"}
															</span>
															{!isCorrect && (
																<span className="text-[#a78bfa]">
																	(Correct: {q.options[q.correct]})
																</span>
															)}
														</div>
														<p className="text-[11px] text-[#8b8da4] leading-relaxed">
															{q.explanation}
														</p>
													</div>
												);
											})}
										</div>

										<button
											type="button"
											onClick={() => setActiveQuiz(null)}
											className="w-full py-3 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold shadow-lg shadow-purple-900/40 cursor-pointer mt-2">
											Configure Another Quiz
										</button>
									</div>
								)}
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default AIQuizPage;
