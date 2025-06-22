import React from "react";

const Categories = ({ category, setCategory, categories }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-6 px-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          aria-pressed={category === cat}
          className={`px-4 py-2 rounded-full border transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#319795] ${
            category === cat
              ? "bg-[#319795] text-white border-[#319795]"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default Categories;
