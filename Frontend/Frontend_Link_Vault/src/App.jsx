import { useState } from "react";
import { API_BASE_URL } from "./config";
import LinkCard from "./components/LinkCard";
import SearchBar from "./components/SearchBar";
import CategorySidebar from "./components/CategorySidebar";
import AddLinkDialog from "./components/AddLinkDialog";
import AuthDialog from "./components/AuthDialog";
import "./App.css";

const PLATFORMS = ["All", "TikTok", "YouTube", "Instagram", "Facebook"];

const PLATFORM_COLORS = {
  TikTok: "#EE1D52",
  YouTube: "#FF0000",
  Instagram: "#C13584",
  Facebook: "#1877F2",
};

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
  //State for time range filter
  const [timeRange, setTimeRange] = useState("Any time");
  //State for category filter
  const [category, setCategory] = useState(ALL);
  //State for the add link dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  // Normalize the search query for case-insensitive matching
  const normalizedQuery = query.trim().toLowerCase();
  // The saved links themselves. Seeded from mock data, then owned by the user —
  // Step 8 is the first step where this is no longer a fixed module constant.
  const [links, setLinks] = useState([]);
  // "Now", captured once at mount. Calling Date.now() during render makes the
  // render impure (React lint flags it) — the value must be stable per render.
  const [now] = useState(() => Date.now());

  // Auth state. null = logged out; { id, name } = logged in. id comes from
  // the real backend response and is required for every subsequent
  // /api/videolinks/{userId} call — it's not just a display value.
  const [user, setUser] = useState(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [linksError, setLinksError] = useState("");

  const [loadingLinks, setLoadingLinks] = useState(false);

  // Open the auth dialog in the given mode. The dialog itself will call back
  // to handleAuth() on success, which sets the user and fetches their links.
  function openAuth(mode) {
    setAuthMode(mode); // "login" or "signup" — controls which fields AuthDialog shows
    setAuthDialogOpen(true); // flips the flag that gates rendering
  }

  // Handle a successful login or signup. The apiUser object comes from the
  // backend response and contains the user's id, firstName, and lastName.
  async function handleAuth(apiUser) {
    setUser({
      id: apiUser.id,
      name: `${apiUser.firstName} ${apiUser.lastName}`,
    });
    setAuthDialogOpen(false);
    setLinksError("");
    setLoadingLinks(true);

    // Fetch the user's links from the backend API. This is the first time we
    // call the real backend, so we need to handle errors and show a loading state.
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/videolinks/${apiUser.id}`,
      );
      if (response.ok) {
        const serverLinks = await response.json();
        setLinks(serverLinks);
        const categories = [
          ...new Set(serverLinks.map((link) => link.category)),
        ];
        setCategoryList(categories.length > 0 ? categories : ["General"]);
      } else {
        setLinksError("Couldn't load your links. Try refreshing.");
      }
    } catch {
      setLinksError("Couldn't reach the server. Is the API running?");
    } finally {
      setLoadingLinks(false);
    }
  }

  // Signing out only hides the UI — it does not clear links/categoryList.
  // The mock data stays in memory so signing back in isn't a fresh start.
  function signOut() {
    setUser(null);
  }

  // Filter the links based on the selected time range. The TIME_RANGES array is
  // a constant, so we can find the selected range by label.
  const range = TIME_RANGES.find((r) => r.label === timeRange);

  // Filter the links based on platform, search query, and time range
  const visibleLinks = links.filter((link) => {
    const matchesPlatform = platform === "All" || link.platform === platform;

    const matchesQuery =
      normalizedQuery === "" ||
      link.title.toLowerCase().includes(normalizedQuery) ||
      link.url.toLowerCase().includes(normalizedQuery) ||
      link.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    const matchesTime =
      range.days === null ||
      (now - new Date(link.createdAtUtc)) / 86400000 <= range.days;

    const matchesCategory = category === ALL || link.category === category;

    return matchesPlatform && matchesQuery && matchesTime && matchesCategory;
  });

  // The user's categories. Seeded once from the mock data, then owned by the user.
  const [categoryList, setCategoryList] = useState([]);

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

  // Remove a link by id. .filter() returns a new array, so React sees the change.
  async function deleteLink(id) {
    setLinksError("");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/videolinks/${user.id}/${id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        setLinksError("Couldn't delete that link. Please try again.");
        return;
      }

      setLinks(links.filter((link) => link.id !== id));
    } catch {
      setLinksError("Couldn't reach the server. Is the API running?");
    }
  }
  //User icon initials helper.
  function initials(name) {
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  return (
    //Header
    <div className="app">
      <header className="app-header">
        <h1 className="brand">Video Link Vault</h1>
        <div className="header-actions">
          {user ? (
            <>
              <button
                className="btn-primary"
                onClick={() => setDialogOpen(true)}
              >
                Add link +
              </button>
              <div className="user-chip">
                <span className="user-avatar">{initials(user.name)}</span>
                <span className="user-name">{user.name}</span>
              </div>
              <button className="btn-secondary" onClick={signOut}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 8l-4 4 4 4M6 12h12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-secondary"
                onClick={() => openAuth("login")}
              >
                Log in
              </button>
              <button
                className="btn-primary"
                onClick={() => openAuth("signup")}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </header>
      <div className="app-body">
        <CategorySidebar
          categories={user ? categories : []}
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
          {linksError && <p className="links-error">{linksError}</p>}
          <div className="chips">
            {PLATFORMS.map((name) => (
              <button
                key={name}
                className={name === platform ? "chip chip-active" : "chip"}
                style={
                  PLATFORM_COLORS[name]
                    ? { "--chip-brand": PLATFORM_COLORS[name] }
                    : undefined
                }
                onClick={() => setPlatform(name)}
              >
                {name}
              </button>
            ))}
          </div>
          {user ? (
            loadingLinks ? (
              <p className="empty">Loading your links…</p>
            ) : links.length === 0 ? (
              <div className="empty-auth">
                <p className="empty">No links saved yet.</p>
                <button
                  className="btn-outline"
                  onClick={() => setDialogOpen(true)}
                >
                  Add your first link
                </button>
              </div>
            ) : (
              <>
                <div className="card-grid">
                  {visibleLinks.map((link) => (
                    <LinkCard key={link.id} link={link} onDelete={deleteLink} />
                  ))}
                </div>

                {visibleLinks.length === 0 && (
                  <p className="empty">No links match your filters.</p>
                )}
              </>
            )
          ) : (
            <div className="empty-auth">
              <p className="empty">No links saved yet.</p>
              <button
                className="btn-outline"
                onClick={() => openAuth("signup")}
              >
                Add your first link
              </button>
            </div>
          )}
        </main>
      </div>
      <footer className="app-footer">
        <div>
          <div>Video Link Vault</div>
          <div className="muted">
            {user ? links.length : 0} saved · {user ? visibleLinks.length : 0}{" "}
            shown
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
          userId={user.id}
          platforms={PLATFORMS.slice(1)}
          categoryOptions={categoryList}
          defaultCategory={category === ALL ? categoryList[0] : category}
          onAdd={addLink}
          onClose={() => setDialogOpen(false)}
        />
      )}
      {authDialogOpen && (
        <AuthDialog
          mode={authMode}
          onModeChange={setAuthMode}
          onAuth={handleAuth}
          onClose={() => setAuthDialogOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
