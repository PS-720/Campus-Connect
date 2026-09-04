import React from "react";

const AiStudyTip = ({ onStartQuiz }) => {
	return (
		<div className="rounded-2xl p-4 bg-gradient-to-b from-[#18102e] to-[#0f0d1a] border border-[#382662] relative overflow-hidden shadow-lg shadow-purple-950/20">
			{/* Header */}
			<div className="flex items-center gap-2 mb-2">
				<svg
					className="w-4 h-4 text-[#a78bfa]"
					viewBox="0 0 24 24"
					fill="currentColor">
					<path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6.4-4.8-6.4 4.8 2.4-7.2-6-4.8h7.6z" />
				</svg>
				<h4 className="text-xs font-bold text-[#c4b5fd] tracking-tight">
					AI Study Tip
				</h4>
			</div>

			{/* Description */}
			<p className="text-xs text-[#9d9eb3] leading-relaxed">
				You have a Data Structures exam in 3 days. Try the AI Quiz Generator to
				test your knowledge on trees and graphs!
			</p>

			{/* Action */}
			<button
				type="button"
				onClick={onStartQuiz}
				className="mt-3 text-xs font-bold text-[#a78bfa] hover:text-white flex items-center gap-1 transition-colors cursor-pointer group">
				<span>Start Quiz</span>
				<span className="group-hover:translate-x-0.5 transition-transform">
					→
				</span>
			</button>
		</div>
	);
};

export default AiStudyTip;
