import React from 'react'

const Privacy = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy (summary)</h1>
      <p className="text-gray-700 mb-4">Last updated: November 25, 2025</p>

      <p className="text-gray-700 mb-4">
        ArchaiMap collects only the images and metadata you choose to upload for the purpose of providing
        imagery analysis services. We process uploaded images to generate analysis results.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">What We Collect</h2>
      <p className="text-gray-700 mb-4">Images, optional metadata, and anonymized usage logs.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Data</h2>
      <p className="text-gray-700 mb-4">Uploaded images are used to run model inference and provide analysis results.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Sharing</h2>
      <p className="text-gray-700 mb-4">We do not sell or share your images with third parties except where required by law.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Deletion</h2>
      <p className="text-gray-700 mb-4">You may request deletion of your uploaded data by contacting: <a className="underline text-archai-orange-600" href="mailto:contact@archaimap.example">contact@archaimap.example</a></p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Security</h2>
      <p className="text-gray-700 mb-4">We implement reasonable technical measures to protect data. However, avoid uploading sensitive personal information.</p>
    </div>
  )
}

export default Privacy
