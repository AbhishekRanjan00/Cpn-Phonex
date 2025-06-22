import React from "react";

const SearchBar = ({ search, setSearch }) => {
  return (
    <div className="px-4 sm:px-6 md:px-8 mt-6">
      <input
        type="text"
        placeholder="Search for products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-xl py-3 px-4 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#319795] transition"
      />
    </div>
  );
};

export default SearchBar;
