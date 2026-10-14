import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import AIStudySidebar from "../components/aistudy/AIStudySidebar";
import AIStudyRightPanel from "../components/aistudy/AIStudyRightPanel";

const SAVED_CHATS = [
	{ id: 1, title: "Recursion & Backtracking" },
	{ id: 2, title: "Database Normalization" },
	{ id: 3, title: "OS Process Scheduling" },
	{ id: 4, title: "Network Protocols" },
];

const JAVA_CODE_SAMPLE = `// Base class
abstract class Shape {
    abstract double area();

    void display() {
        System.out.println("Area: " + area());
    }
}

// Subclass 1
class Circle extends Shape {
    double radius;
    Circle(double r) { this.radius = r; }

    @Override
    double area() { return Math.PI * radius * radius; }
}

// Subclass 2
class Rectangle extends Shape {
    double width, height;
    Rectangle(double w, double h) { width = w; height = h; }

    @Override
    double area() { return width * height; }
}

// Polymorphic usage
Shape s1 = new Circle(5);
Shape s2 = new Rectangle(4, 6);
s1.display(); // Area: 78.54
s2.display(); // Area: 24.0`;

const KEY_POINTS = [
	"Runtime polymorphism uses method overriding",
	"Compile-time uses method overloading",
	"Achieved through inheritance and interfaces",
	"Promotes code reusability and flexibility",
];

const SUGGESTED_FOLLOWUPS = [
	"What is method overloading vs overriding?",
	"How does interface help in polymorphism?",
	"Explain abstract classes vs interfaces",
];

const AIStudyPage = ({ onNavigateTab }) => {
	const [selectedSubject, setSelectedSubject] = useState("Computer Science");
	const [activeChatId, setActiveChatId] = useState(1);
	const [savedChats, setSavedChats] = useState(SAVED_CHATS);
	const [query, setQuery] = useState("");
	const [chatMessages, setChatMessages] = useState([
		{
			id: 1,
			sender: "user",
			text: "Explain polymorphism in Java with an example.",
		},
		{
			id: 2,
			sender: "ai",
			intro:
				"Polymorphism in Java is the ability of an object to take on many forms. It allows one interface to be used for different underlying data types.",
			code: JAVA_CODE_SAMPLE,
			keyPoints: KEY_POINTS,
			followups: SUGGESTED_FOLLOWUPS,
		},
	]);

	const handleSendQuery = (textToSend) => {
		const q = textToSend || query;
		if (!q.trim()) return;

		setChatMessages((prev) => {
			const nextId = prev.length + 1;
			const userMsg = {
				id: nextId,
				sender: "user",
				text: q.trim(),
			};

			const aiMsg = {
				id: nextId + 1,
				sender: "ai",
				intro: `Here is an in-depth explanation regarding "${q.trim()}" tailored for ${selectedSubject}:`,
				code: `// Example demonstrating ${q.trim()} in ${selectedSubject}\npublic class StudyAssistantDemo {\n    public static void main(String[] args) {\n        System.out.println("Concept active: ${q.trim()}");\n    }\n}`,
				keyPoints: [
					"Core foundational concept essential for exams and interviews",
					"Ensures modular separation and clean architectural design",
					"Refer to uploaded semester notes for specific syllabus criteria",
				],
				followups: [
					`How to optimize ${q.trim()}?`,
					`Real-world implementation of ${q.trim()}`,
					"Generate 3 practice MCQs on this topic",
				],
			};

			return [...prev, userMsg, aiMsg];
		});

		setQuery("");
	};

	const handleNewChat = () => {
		setSavedChats((prev) => {
			const nextChatId = prev.length + 1;
			const newChat = {
				id: nextChatId,
				title: `New Chat #${nextChatId}`,
			};
			setActiveChatId(nextChatId);
			return [newChat, ...prev];
		});
		setChatMessages([]);
	};

	return (
		<div className="h-screen bg-[#07080b] text-white flex overflow-hidden">
			{/* Left Main App Sidebar */}
			<Sidebar activeTab="AI Study" onSelectTab={onNavigateTab} />

			{/* Sub-Sidebar: AI Study Chat Management */}
			<AIStudySidebar
				selectedSubject={selectedSubject}
				onSelectSubject={setSelectedSubject}
				savedChats={savedChats}
				activeChatId={activeChatId}
				onSelectChat={(id) => setActiveChatId(id)}
				onNewChat={handleNewChat}
			/>

			{/* Center: Main Interactive Chat Screen */}
			<div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0b0f]/40">
				{/* Top Status Bar */}
				<div className="px-6 py-4 border-b border-[#151722] bg-[#07080b]/90 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
					<div className="flex items-center gap-2">
						<span className="w-2 h-2 rounded-full bg-[#10b981]" />
						<span className="text-sm font-semibold text-white tracking-tight">
							CampusConnect AI — {selectedSubject}
						</span>
					</div>

					<div className="flex items-center gap-3 text-[#71748d]">
						{/* Bookmark action */}
						<button
							type="button"
							className="p-1.5 rounded-lg hover:text-white hover:bg-[#141622] transition-colors cursor-pointer"
							title="Bookmark conversation">
							<svg
								className="w-4.5 h-4.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.8}
									d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
								/>
							</svg>
						</button>
						{/* Export / Share action */}
						<button
							type="button"
							className="p-1.5 rounded-lg hover:text-white hover:bg-[#141622] transition-colors cursor-pointer"
							title="Share conversation">
							<svg
								className="w-4.5 h-4.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.8}
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Chat Messages Stream */}
				<div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
					{chatMessages.length === 0 ? (
						<div className="flex-1 flex flex-col items-center justify-center text-center p-8">
							<div className="w-12 h-12 rounded-2xl bg-[#141622] border border-[#222538] flex items-center justify-center text-[#a78bfa] mb-3 shadow-lg">
								<svg
									className="w-6 h-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
									/>
								</svg>
							</div>
							<h3 className="text-sm font-bold text-white mb-1">
								Start studying {selectedSubject}
							</h3>
							<p className="text-xs text-[#71748d] max-w-sm">
								Ask any question, request code examples, or explore syllabus topics
								with instant grounded answers.
							</p>
						</div>
					) : (
						chatMessages.map((msg) => {
							if (msg.sender === "user") {
								return (
									<div key={msg.id} className="flex justify-end">
										<div className="bg-[#7c3aed] text-white text-xs sm:text-sm font-medium px-5 py-3 rounded-2xl rounded-br-xs max-w-xl shadow-lg shadow-purple-950/30">
											{msg.text}
										</div>
									</div>
								);
							}

							// AI response block (matching screenshot exactly)
							return (
								<div key={msg.id} className="flex flex-col gap-4 max-w-3xl">
									<div className="bg-[#0e1017] border border-[#1d202e] rounded-2xl p-6 shadow-xl flex flex-col gap-4">
										{/* Brand Header */}
										<div className="flex items-center gap-2.5">
											<div className="w-5 h-5 rounded-md bg-[#804bdf] flex items-center justify-center p-1 shadow-sm">
												<svg
													className="w-full h-full text-white"
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
											<span className="text-xs font-bold text-white tracking-tight">
												CampusConnect AI
											</span>
										</div>

										{/* Introductory Explanation */}
										<p className="text-xs sm:text-sm text-[#d4d6e2] leading-relaxed">
											<strong className="text-white font-semibold">
												{msg.intro.split(" ")[0]}
											</strong>{" "}
											{msg.intro.substring(msg.intro.indexOf(" ") + 1)}
										</p>

										{/* Code Block Container */}
										{msg.code && (
											<div className="bg-[#08090d] border border-[#191b26] rounded-xl p-4 overflow-x-auto font-mono text-xs text-[#a5b4fc] leading-relaxed shadow-inner">
												<pre className="whitespace-pre">
													<code>{msg.code}</code>
												</pre>
											</div>
										)}

										{/* Key Points Section */}
										{msg.keyPoints && (
											<div className="flex flex-col gap-2 pt-2">
												<h4 className="text-xs font-bold text-white tracking-tight">
													Key Points
												</h4>
												<div className="flex flex-col gap-1.5">
													{msg.keyPoints.map((point) => (
														<div
															key={point}
															className="flex items-center gap-2.5 text-xs text-[#9d9fb5]">
															<div className="w-4 h-4 rounded-full bg-[#1e1738] border border-[#3b2b68] flex items-center justify-center text-[#a78bfa] shrink-0 text-[10px]">
																✓
															</div>
															<span>{point}</span>
														</div>
													))}
												</div>
											</div>
										)}

										{/* Suggested Follow-ups */}
										{msg.followups && (
											<div className="flex flex-col gap-2 pt-2 border-t border-[#181a26]">
												<span className="text-[11px] font-semibold text-[#71748d]">
													Suggested Follow-ups
												</span>
												<div className="flex flex-wrap gap-2">
													{msg.followups.map((followup) => (
														<button
															key={followup}
															type="button"
															onClick={() => handleSendQuery(followup)}
															className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#141522] text-[#c4b5fd] border border-[#27263d] hover:bg-[#20173e] hover:border-[#4c3780] transition-colors cursor-pointer text-left">
															{followup}
														</button>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* Bottom Input Field Box */}
				<div className="p-4 border-t border-[#151722] bg-[#07080b]/90">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSendQuery();
						}}
						className="relative flex items-center gap-3">
						{/* Attach File / Note */}
						<button
							type="button"
							className="text-[#71748d] hover:text-white p-2 rounded-xl hover:bg-[#141622] transition-colors cursor-pointer"
							title="Attach note or PDF">
							<svg
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.8}
									d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
								/>
							</svg>
						</button>

						{/* Input text */}
						<div className="flex-1 relative">
							<input
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Ask anything about your studies..."
								className="w-full bg-[#12141e] border border-[#1e202d] focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-[#50536c] outline-none transition-colors"
							/>
						</div>

						{/* Mic button */}
						<button
							type="button"
							className="text-[#71748d] hover:text-white p-2 rounded-xl hover:bg-[#141622] transition-colors cursor-pointer"
							title="Voice input">
							<svg
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.8}
									d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
								/>
							</svg>
						</button>

						{/* Send query button */}
						<button
							type="submit"
							disabled={!query.trim()}
							className="p-3 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md shadow-purple-900/30 transition-all cursor-pointer">
							<svg
								className="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
								/>
							</svg>
						</button>
					</form>
				</div>
			</div>

			{/* Right Panel: Related Notes, Key Concepts, Quick Actions */}
			<AIStudyRightPanel
				onSelectNote={(note) => {
					handleSendQuery(`Tell me more about ${note.title}`);
				}}
				onSelectConcept={(concept) => {
					handleSendQuery(`Explain ${concept} in detail`);
				}}
				onQuickAction={(actionId) => {
					if (actionId === "summarize") {
						handleSendQuery("Summarize the current topic in 3 bullet points");
					} else if (actionId === "quiz") {
						handleSendQuery("Generate a 3-question quiz on this topic");
					} else if (actionId === "tips") {
						handleSendQuery("Give me top exam study tips for this topic");
					}
				}}
			/>
		</div>
	);
};

export default AIStudyPage;
