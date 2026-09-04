import React from "react";

const CATEGORIES = ["All", "Technology", "Arts", "Business", "Sports"];

const CategoryPills = ({ activeCategory = "All", onSelectCategory }) => {
	return (
		<div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
			{CATEGORIES.map((category) => {
				const isActive = activeCategory === category;
				return (
					<button
						key={category}
						onClick={() => onSelectCategory(category)}
						className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
							isActive
								? "bg-[#7c3aed] text-white shadow-md shadow-purple-900/40"
								: "bg-[#141520] text-[#9ca3af] border border-[#202230] hover:text-white hover:bg-[#1c1e2d] hover:border-[#303348]"
						}`}>
						{category}
					</button>
				);
			})}
		</div>
	);
};

export default CategoryPills;
