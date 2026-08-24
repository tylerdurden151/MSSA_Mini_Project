import { useState } from "react";
import { mockLinks } from "./mockData/mockLinks";
import LinkCard from "./components/LinkCard";
import "./App.css";

const PLATFORMS = ["All", "TikTok", "YouTube", "Instagram", "Facebook"];

function App() {
  const [platform, setPlatform] = useState("All");
  const visibleLinks =
    platform === "All"
      ? mockLinks
      : mockLinks.filter((link) => link.platform === platform);
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
            {/* Step 6: search box + date filter */}
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
