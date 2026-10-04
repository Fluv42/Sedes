import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const path = window.location.pathname.replace(/\/+$/, '') || '/'
const app = <StrictMode><App initialPath={path} /></StrictMode>

// Built pages arrive pre-rendered; the dev server starts from an empty root.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
