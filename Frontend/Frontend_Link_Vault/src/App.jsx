import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { mockLinks } from './mockData/mockLinks'
import './App.css'

function App() {
  return (
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
            {/* Step 5: platform filter chips */}
          </div>

          <div className="card-grid">
            {/* Step 4: link cards */}
          </div>
        </main>
      </div>

      <footer className="app-footer">
        <div>
          <div>Video Link Vault</div>
          <div className="muted">
            {mockLinks.length} saved · {mockLinks.length} shown
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
  )
}

export default App
