import React, { useState } from "react";

const TOPICS = [
	"#HackMIT2025",
	"#AIWorkshop",
	"#CodingClub",
	"#ExamSeason",
	"#CampusLife",
	"#OpenSource",
];

const TopicFilters = ({ onSelectTopic, selectedTopic }) => {
	const [activeTopic, setActiveTopic] = useState(selectedTopic || null);

	const handleTopicClick = (topic) => {
		const next = activeTopic === topic ? null : topic;
		setActiveTopic(next);
		if (onSelectTopic) onSelectTopic(next);
	};

	return (
		<div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar select-none">
			{TOPICS.map((topic) => {
				const isSelected = activeTopic === topic;
				return (
					<button
						key={topic}
						onClick={() => handleTopicClick(topic)}
						className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-150 cursor-pointer ${
							isSelected
								? "bg-[#7c3aed] text-white border border-[#8b5cf6] shadow-sm shadow-purple-900/40"
								: "bg-[#141520] text-[#a78bfa] border border-[#262340] hover:bg-[#1f1b36] hover:border-[#3d3363]"
						}`}>
						{topic}
					</button>
				);
			})}
		</div>
	);
};

export default TopicFilters;
