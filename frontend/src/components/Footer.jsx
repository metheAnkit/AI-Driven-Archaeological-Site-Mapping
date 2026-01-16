import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm font-semibold">© 2026 ArchaiMap. All rights reserved.</p>
            <p className="text-xs text-gray-400 mt-1 max-w-lg">
              ArchaiMap provides AI-powered imagery analysis tools for vegetation segmentation and soil
              classification to support archaeological research. Data uploaded is used only for processing
              requested analyses unless you explicitly provide permission for other uses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex gap-4">
              <Link to="/privacy" className="text-sm text-white hover:underline">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-white hover:underline">Terms of Use</Link>
            </div>
            <div className="text-xs text-gray-400">
              Contact: <a className="underline" href="mailto:contact@archaimap.example">contact@archaimap.example</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
