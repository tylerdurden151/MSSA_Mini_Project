import "./SearchBar.css";

function SearchBar({
  query,
  onQueryChange,
  timeRange,
  onTimeRangeChange,
  ranges,
}) {
  return (
    <div className="toolbar">
      <div className="search">
        <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle
            cx="11"
            cy="11"
            r="7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="16.5"
            y1="16.5"
            x2="21"
            y2="21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <input
          className="search-input"
          type="text"
          placeholder="Search by title, tag, or URL"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      <select
        className="select"
        value={timeRange}
        onChange={(e) => onTimeRangeChange(e.target.value)}
      >
        {ranges.map((r) => (
          <option key={r.label} value={r.label}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SearchBar;
