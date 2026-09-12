import "./SearchInput.css";

const SearchInput = ({ searchTerm, onSearch }) => {
  return (
    
    <input
      className="search-input"
      type="text"
      placeholder="Kunstwerk oder Künstler suchen"
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
    />
    
  );
};

export default SearchInput;