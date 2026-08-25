import { useState } from "react";
import { mockLinks } from "./mockData/mockLinks";
import LinkCard from "./components/LinkCard";
import SearchBar from "./components/SearchBar";
import CategorySidebar from "./components/CategorySidebar";
import AddLinkDialog from "./components/AddLinkDialog";
import "./App.css";

const PLATFORMS = ["All", "TikTok", "YouTube", "Instagram", "Facebook"];

const ALL = "All links";
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
  //State for category filter
  const [timeRange, setTimeRange] = useState("Any time");
  //State for category filter
  const [category, setCategory] = useState(ALL);
  //State for the add link dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  // Normalize the search query for case-insensitive matching
  const normalizedQuery = query.trim().toLowerCase();
  // The saved links themselves. Seeded from mock data, then owned by the user —
  // Step 8 is the first step where this is no longer a fixed module constant.
  const [links, setLinks] = useState(mockLinks);

  // Find the selected time range object based on the current timeRange state
  const range = TIME_RANGES.find((r) => r.label === timeRange);

  // Filter the mockLinks based on platform, search query, and time range
  const visibleLinks = links.filter((link) => {
    const matchesPlatform = platform === "All" || link.platform === platform;

    const matchesQuery =
      normalizedQuery === "" ||
      link.title.toLowerCase().includes(normalizedQuery) ||
      link.url.toLowerCase().includes(normalizedQuery) ||
      link.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    const matchesTime =
      range.days === null ||
      (Date.now() - new Date(link.createdAtUtc)) / 86400000 <= range.days;

    const matchesCategory = category === ALL || link.category === category;

    return matchesPlatform && matchesQuery && matchesTime && matchesCategory;
  });

  // The user's categories. Seeded once from the mock data, then owned by the user.
  const [categoryList, setCategoryList] = useState(() => [
    ...new Set(mockLinks.map((link) => link.category)),
  ]);

  // Count how many links are in each category (name -> count)
  const categoryCounts = new Map();
  for (const link of links) {
    categoryCounts.set(
      link.category,
      (categoryCounts.get(link.category) ?? 0) + 1,
    );
  }

  // One row per user category, plus the "All links" pseudo-row on top
  const categories = [
    [ALL, links.length],
    ...categoryList.map((name) => [name, categoryCounts.get(name) ?? 0]),
  ];

  // Add a new category, unless it is blank or already exists.
  // App owns the list, so App enforces the rules.
  function createCategory(rawName) {
    const name = rawName.trim();
    const taken = [ALL, ...categoryList].some(
      (c) => c.toLowerCase() === name.toLowerCase(),
    );

    if (name === "" || taken) return;

    setCategoryList([...categoryList, name]);
    setCategory(name);
  }
  // Add a new link. App owns the list, so App is where it changes.
  function addLink(newLink) {
    setLinks([newLink, ...links]);
  }

  return (
    //Header
    <div className="app">
      <header className="app-header">
        <h1 className="brand">Video Link Vault</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setDialogOpen(true)}>
            Add link +
          </button>
          <button className="btn-ghost">Log in</button>
        </div>
      </header>
      <div className="app-body">
        <CategorySidebar
          categories={categories}
          selected={category}
          onSelect={setCategory}
          onCreate={createCategory}
        />
        <main className="content">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            ranges={TIME_RANGES}
          />

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

          {visibleLinks.length === 0 && (
            <p className="empty">No links match your filters.</p>
          )}
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
      {dialogOpen && (
        <AddLinkDialog
          platforms={PLATFORMS.slice(1)}
          categoryOptions={categoryList}
          defaultCategory={category === ALL ? categoryList[0] : category}
          onAdd={addLink}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
