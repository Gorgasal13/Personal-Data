import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="search-div">
      <input
        className="form-control"
        type="search"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Search by first name or last name"
      />
      <CiSearch className="icon" size={30} onClick={handleSearchClick} />
    </div>
  );
}

export default SearchBar;
