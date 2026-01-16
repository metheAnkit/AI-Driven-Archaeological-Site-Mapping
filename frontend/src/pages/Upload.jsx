import { useState, useRef, useEffect } from 'react'
import apiClient from '../services/api'
import { Leaf, Soil, Play } from '../components/Icons'

const Upload = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const [vegetationFiles, setVegetationFiles] = useState([])
  const [soilFiles, setSoilFiles] = useState([])
  const [vegetationPreviews, setVegetationPreviews] = useState([])
  const [soilPreviews, setSoilPreviews] = useState([])
  const [vegetationResults, setVegetationResults] = useState(null)
  const [soilResults, setSoilResults] = useState(null)
  const [loading, setLoading] = useState({ vegetation: false, soil: false })
  
  const vegetationInputRef = useRef(null)
  const soilInputRef = useRef(null)

  const handleVegetationFilesChange = (files) => {
    const fileArray = Array.from(files || [])
    setVegetationFiles(fileArray)
    const previews = fileArray.map(file => URL.createObjectURL(file))
    setVegetationPreviews(previews)
  }

  const handleSoilFilesChange = (files) => {
    const fileArray = Array.from(files || [])
    setSoilFiles(fileArray)
    const previews = fileArray.map(file => URL.createObjectURL(file))
    setSoilPreviews(previews)
  }

  useEffect(() => {
    return () => {
      vegetationPreviews.forEach(url => URL.revokeObjectURL(url))
      soilPreviews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [vegetationPreviews, soilPreviews])

  const handleVegetationUpload = async () => {
    if (vegetationFiles.length === 0) return
    setLoading(prev => ({ ...prev, vegetation: true }))
    setVegetationResults(null)
    const formData = new FormData()
    vegetationFiles.forEach(file => formData.append('files', file))
    try {
      const response = await apiClient.post('/api/vegetation/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setVegetationResults(response.data)
    } catch (error) {
      console.error('Error uploading vegetation images:', error)
      const errorMessage = error.response?.data?.detail || error.message || 'Network Error'
      setVegetationResults({ error: errorMessage })
    } finally {
      setLoading(prev => ({ ...prev, vegetation: false }))
    }
  }

  const handleSoilUpload = async () => {
    if (soilFiles.length === 0) return
    setLoading(prev => ({ ...prev, soil: true }))
    setSoilResults(null)
    const formData = new FormData()
    soilFiles.forEach(file => formData.append('files', file))
    try {
      const response = await apiClient.post('/api/soil-classify/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSoilResults(response.data)
    } catch (error) {
      console.error('Error uploading soil images:', error)
      const errorMessage = error.response?.data?.detail || error.message || 'Network Error'
      setSoilResults({ error: errorMessage })
    } finally {
      setLoading(prev => ({ ...prev, soil: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-archai-orange-500 text-white rounded-3xl p-6 flex items-center gap-4">
            <div className="text-4xl md:text-5xl">⬆️</div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">Upload Images</h1>
              <p className="text-sm sm:text-base md:text-lg text-archai-orange-100">
                Process aerial or satellite imagery with AI for archaeological site detection
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vegetation Segmentation */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Leaf className="w-6 h-6 text-archai-orange-500 mr-2"/>
              <h2 className="text-2xl font-bold text-gray-800">Vegetation Segmentation</h2>
            </div>
            <p className="text-gray-600 mb-6">Upload aerial or satellite imagery for vegetation pattern analysis.</p>
            
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-archai-orange-500 transition"
              onClick={() => vegetationInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy' }}
              onDrop={(e) => {
                e.preventDefault()
                const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'))
                if (files.length) handleVegetationFilesChange(files)
              }}
            >
              <div className="text-5xl mb-4 text-archai-orange-500">⬆️</div>
              <p className="text-gray-700 mb-2">Drop images here or click to browse</p>
              <p className="text-sm text-gray-500">Supports: JPG, PNG, WebP</p>
              <input
                ref={vegetationInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleVegetationFilesChange(e.target.files)}
              />
            </div>
            
            {vegetationFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">{vegetationFiles.length} file(s) selected</p>
                <div className="grid grid-cols-1 gap-3">
                  {vegetationFiles.map((file, idx) => (
                    <div key={idx} className="border rounded-lg p-2">
                      <p className="text-xs font-semibold text-gray-700 mb-1 truncate">{file.name}</p>
                      {vegetationPreviews[idx] && (
                        <img src={vegetationPreviews[idx]} alt={`Preview ${idx + 1}`} className="w-full h-48 object-cover rounded border" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={handleVegetationUpload}
              disabled={vegetationFiles.length === 0 || loading.vegetation}
              className="mt-6 w-full bg-archai-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-archai-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2"/>
              {loading.vegetation ? 'Running Vegetation...' : 'Run Vegetation'}
            </button>

            {vegetationResults && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-4">Results:</h3>
                {vegetationResults.error ? (
                  <p className="text-red-600">{vegetationResults.error}</p>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">Processed: {vegetationResults.processed} / {vegetationResults.total_files}</p>
                    {vegetationResults.results?.map((result, idx) => (
                      result.success !== false && (
                        <div key={idx} className="mt-6 p-4 bg-white rounded border">
                          <p className="text-sm font-semibold mb-2 text-gray-700">{result.filename}</p>
                          <p className="text-xs text-gray-600 mb-3">Segments: {result.segment_count || 0}</p>
                          {result.annotated_image && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-gray-600 mb-2">Segmentation Result:</p>
                              <img 
                                src={result.annotated_image} 
                                alt="Vegetation segmentation" 
                                className="w-full h-auto rounded border max-h-96 object-cover"
                              />
                            </div>
                          )}
                          {result.error && <p className="text-xs text-red-600 mt-2">Error: {result.error}</p>}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Soil Classification */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Soil className="w-6 h-6 text-archai-orange-500 mr-2"/>
              <h2 className="text-2xl font-bold text-gray-800">Soil Classification</h2>
            </div>
            <p className="text-gray-600 mb-6">Upload images for soil classification and analysis.</p>
            
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-archai-orange-500 transition"
              onClick={() => soilInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy' }}
              onDrop={(e) => {
                e.preventDefault()
                const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'))
                if (files.length) handleSoilFilesChange(files)
              }}
            >
              <div className="text-5xl mb-4 text-archai-orange-500">⬆️</div>
              <p className="text-gray-700 mb-2">Drop images here or click to browse</p>
              <p className="text-sm text-gray-500">Supports: JPG, PNG, WebP</p>
              <input
                ref={soilInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleSoilFilesChange(e.target.files)}
              />
            </div>
            
            {soilFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">{soilFiles.length} file(s) selected</p>
                <div className="grid grid-cols-1 gap-3">
                  {soilFiles.map((file, idx) => (
                    <div key={idx} className="border rounded-lg p-2">
                      <p className="text-xs font-semibold text-gray-700 mb-1 truncate">{file.name}</p>
                      {soilPreviews[idx] && (
                        <img src={soilPreviews[idx]} alt={`Preview ${idx + 1}`} className="w-full h-48 object-cover rounded border" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={handleSoilUpload}
              disabled={soilFiles.length === 0 || loading.soil}
              className="mt-6 w-full bg-archai-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-archai-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2"/>
              {loading.soil ? 'Running Classification...' : 'Run Classification'}
            </button>

            {soilResults && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-4">Results:</h3>
                {soilResults.error ? (
                  <p className="text-red-600">{soilResults.error}</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4">Processed: {soilResults.processed || 0} / {soilResults.total_files || 0}</p>
                    {soilResults.results?.map((result, idx) => (
                      <div key={idx} className="mt-6 p-4 bg-white border rounded">
                        <p className="text-sm font-semibold text-gray-700 mb-2">{result.filename}</p>
                        {result.success && result.soil_type ? (
                          <>
                            <div className="mb-4 p-3 rounded bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200">
                              <p className="text-lg font-bold" style={{color: result.soil_type === 'Red Soil' ? '#E74C3C' : result.soil_type === 'Clay Soil' ? '#E67E22' : result.soil_type === 'Black Soil' ? '#2C3E50' : '#4A90E2'}}>
                                {result.soil_type}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">Confidence: {Math.round((result.confidence || 0) * 100)}%</p>
                            </div>
                            {result.annotated_image && (
                              <div className="mt-4">
                                <p className="text-xs font-semibold text-gray-600 mb-2">Detection Result:</p>
                                <img 
                                  src={result.annotated_image} 
                                  alt="Soil detection" 
                                  className="w-full h-auto rounded border max-h-96 object-cover"
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-red-600">{result.error || 'Failed to process'}</p>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload
