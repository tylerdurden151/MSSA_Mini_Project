import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { mockLinks } from './mockData/mockLinks'
import './App.css'

function App() {
  return (
    <div className="App">
      <h1> Video Link Vault</h1>
      <p>{mockLinks.length} links loaded</p>
    </div>
  )
}

export default App
