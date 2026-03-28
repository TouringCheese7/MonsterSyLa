// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './styles/background.css';
import { ClanProvider } from "./context/ClanContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClanProvider>
      <App />
    </ClanProvider>
  </React.StrictMode>,
)