import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [showImage, setShowImage] = useState(true)
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-2 transition font-medium px-3 py-2 rounded-lg"
    const activeClass = isActive(path) 
      ? "text-archai-orange-600 bg-archai-orange-50 border-b-2 border-archai-orange-600" 
      : "text-gray-700 hover:text-archai-orange-600"
    return `${baseClass} ${activeClass}`
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            {showImage ? (
              <img
                src="/logo.png"
                alt="ArchaiMap"
                className="w-10 h-10 object-contain"
                onError={() => setShowImage(false)}
                onLoad={() => setShowImage(true)}
              />
            ) : (
              <span className="text-2xl">🗺️</span>
            )}
            <span className="text-2xl font-black bg-gradient-to-r from-archai-orange-500 via-archai-orange-600 to-archai-orange-700 bg-clip-text text-transparent tracking-tight">ArchaiMap</span>
          </Link>

          <div className="hidden md:flex gap-4">
            <Link to="/" className={getLinkClass("/")}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              Home
            </Link>
            <Link to="/upload" className={getLinkClass("/upload")}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Upload
            </Link>
            <Link to="/explore" className={getLinkClass("/explore")}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore
            </Link>
            <Link to="/about" className={getLinkClass("/about")}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </Link>
          </div>

          <div className="md:hidden">
            <button className="text-gray-700 hover:text-archai-orange-600">☰</button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
