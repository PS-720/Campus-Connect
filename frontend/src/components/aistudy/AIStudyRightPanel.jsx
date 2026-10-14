import React from "react";

const RELATED_NOTES = [
	{ id: 1, title: "DSA Complete Guide" },
	{ id: 2, title: "OOP Concepts" },
	{ id: 3, title: "Java Advanced Features" },
];

const KEY_CONCEPTS = [
	"Polymorphism",
	"Inheritance",
	"Encapsulation",
	"Abstraction",
	"Method Overriding",
];

const QUICK_ACTIONS = [
	{
		id: "summarize",
		label: "Summarize topic",
		icon: (
			<svg className="w-4 h-4 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
			</svg>
		),
	},
	{
		id: "quiz",
		label: "Generate quiz",
		icon: (
			<svg className="w-4 h-4 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
			</svg>
		),
	},
	{
		id: "tips",
		label: "Study tips",
		icon: (
			<svg className="w-4 h-4 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
			</svg>
		),
	},
];

const AIStudyRightPanel = ({ onSelectNote, onSelectConcept, onQuickAction }) => {
	return (
		<div className="w-64 h-full bg-[#0a0b0f] border-l border-[#151722] flex flex-col p-4 gap-6 shrink-0 select-none overflow-y-auto">
			{/* Section 1: Related Notes */}
			<div className="flex flex-col gap-2.5">
				<h4 className="text-[11px] font-bold tracking-wider text-[#4a4d65] uppercase px-1">
					Related Notes
				</h4>
				<div className="flex flex-col gap-1.5">
					{RELATED_NOTES.map((note) => (
						<button
							key={note.id}
							type="button"
							onClick={() => onSelectNote && onSelectNote(note)}
							className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#12141e] border border-[#1e202d] hover:border-[#2d3044] text-xs text-[#c4c6dc] hover:text-white transition-all text-left cursor-pointer">
							<svg
								className="w-4 h-4 text-[#71748d] shrink-0"
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
							<span className="truncate">{note.title}</span>
						</button>
					))}
				</div>
			</div>

			{/* Section 2: Key Concepts */}
			<div className="flex flex-col gap-2.5">
				<h4 className="text-[11px] font-bold tracking-wider text-[#4a4d65] uppercase px-1">
					Key Concepts
				</h4>
				<div className="flex flex-wrap gap-1.5">
					{KEY_CONCEPTS.map((concept) => (
						<button
							key={concept}
							type="button"
							onClick={() => onSelectConcept && onSelectConcept(concept)}
							className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#241747] text-[#a78bfa] border border-[#3b2b68] hover:bg-[#301f5e] transition-colors cursor-pointer">
							{concept}
						</button>
					))}
				</div>
			</div>

			{/* Section 3: Quick Actions */}
			<div className="flex flex-col gap-2.5">
				<h4 className="text-[11px] font-bold tracking-wider text-[#4a4d65] uppercase px-1">
					Quick Actions
				</h4>
				<div className="flex flex-col gap-1.5">
					{QUICK_ACTIONS.map((action) => (
						<button
							key={action.id}
							type="button"
							onClick={() => onQuickAction && onQuickAction(action.id)}
							className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#12141e] border border-[#1e202d] hover:border-[#2d3044] text-xs text-[#c4c6dc] hover:text-white transition-all text-left cursor-pointer">
							{action.icon}
							<span>{action.label}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default AIStudyRightPanel;
