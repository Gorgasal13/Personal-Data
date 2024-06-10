import { useState } from "react";
import { CiSearch } from "react-icons/ci";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="search-div">
      <input
        type="search"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search"
      />
      <CiSearch className="icon" size={30} onClick={handleSearchClick} />
    </div>
  );
}

export default SearchBar;
