import React from 'react'
import ReactDOM from 'react-dom/client'
import DaylightGlide from './variants/Variant26.jsx'
import './index.css'

// The official TalTools site is the "Daylight Glide" design. The old design
// gallery (Gallery.jsx + Variant1–25) is kept in the repo but no longer wired
// into the live site.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DaylightGlide />
  </React.StrictMode>,
)
