import { useState } from "react";
import { mockLinks } from "./mockData/mockLinks";
import LinkCard from "./components/LinkCard";
import "./App.css";

const PLATFORMS = ["All", "TikTok", "YouTube", "Instagram", "Facebook"];

const TIME_RANGES = [
  { label: "Any time", days: null },
  { label: "Past week", days: 7 },
  { label: "Past month", days: 30 },
  { label: "Past year", days: 365 },
];

function App() {
  //State for platform filter, search query, and time range filter
  const [platform, setPlatform] = useState("All");
  //State for search query and time range filter
  const [query, setQuery] = useState("");
  const [timeRange, setTimeRange] = useState("Any time");

  // Normalize the search query for case-insensitive matching
  const normalizedQuery = query.trim().toLowerCase();

  // Find the selected time range object based on the current timeRange state
  const range = TIME_RANGES.find((r) => r.label === timeRange);

  // Filter the mockLinks based on platform, search query, and time range

  const visibleLinks = mockLinks.filter((link) => {
    const matchesPlatform = platform === "All" || link.platform === platform;

    const matchesQuery =
      normalizedQuery === "" ||
      link.title.toLowerCase().includes(normalizedQuery) ||
      link.url.toLowerCase().includes(normalizedQuery) ||
      link.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    const matchesTime =
      range.days === null ||
      (Date.now() - new Date(link.createdAtUtc)) / 86400000 <= range.days;

    return matchesPlatform && matchesQuery && matchesTime;
  });

  return (
    //Header
    <div className="app">
      <header className="app-header">
        <h1 className="brand">Video Link Vault</h1>
        <div className="header-actions">
          <button className="btn-primary">Add link +</button>
          <button className="btn-ghost">Log in</button>
        </div>
      </header>
      <div className="app-body">
        <aside className="sidebar">
          <h2 className="sidebar-title">Categories</h2>
          {/* Step 7: category list goes here */}
        </aside>

        <main className="content">
          <div className="toolbar">
            <div className="search">
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
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
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <select
              className="select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              {TIME_RANGES.map((r) => (
                <option key={r.label} value={r.label}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="chips">
            {PLATFORMS.map((name) => (
              <button
                key={name}
                className={name === platform ? "chip chip-active" : "chip"}
                onClick={() => setPlatform(name)}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="card-grid">
            {visibleLinks.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
          <div className="no-results">
            {visibleLinks.length === 0 && (
              <p className="empty">No links match your filters.</p>
            )}
          </div>
        </main>
      </div>

      <footer className="app-footer">
        <div>
          <div>Video Link Vault</div>
          <div className="muted">
            {mockLinks.length} saved · {visibleLinks.length} shown
          </div>
        </div>
        <nav className="footer-links">
          <a href="#">Import</a>
          <a href="#">Export</a>
          <a href="#">Settings</a>
          <a href="#">Help</a>
        </nav>
      </footer>
    </div>
  );
}

export default App;
