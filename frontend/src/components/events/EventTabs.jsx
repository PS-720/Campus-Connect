import React from "react";

const EVENT_TABS = ["Upcoming", "Registered", "Past"];

const EventTabs = ({ activeTab = "Upcoming", onSelectTab }) => {
	return (
		<div className="flex items-center gap-2 select-none">
			{EVENT_TABS.map((tab) => {
				const isActive = activeTab === tab;
				return (
					<button
						key={tab}
						onClick={() => onSelectTab(tab)}
						className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
							isActive
								? "bg-[#7c3aed] text-white shadow-md shadow-purple-900/40"
								: "bg-[#141520] text-[#9ca3af] border border-[#202230] hover:text-white hover:bg-[#1c1e2d] hover:border-[#303348]"
						}`}>
						{tab}
					</button>
				);
			})}
		</div>
	);
};

export default EventTabs;
