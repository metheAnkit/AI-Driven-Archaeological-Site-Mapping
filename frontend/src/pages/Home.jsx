import React, { useEffect } from 'react'
import { Leaf, Soil, Brain } from '../components/Icons'

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl" style={{background: 'linear-gradient(135deg, #6b4423 0%, #4a2f1a 100%)'}}>
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-40 h-40 rounded-full" style={{background: 'radial-gradient(circle, rgba(255,152,72,0.3) 0%, transparent 70%)'}}></div>
              <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full" style={{background: 'radial-gradient(circle, rgba(255,152,72,0.2) 0%, transparent 70%)'}}></div>
            </div>

            <div className="relative p-8 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Left Content */}
              <div className="flex-1 text-white z-10">
                <div className="inline-block mb-4 px-3 py-1 rounded-full" style={{background: 'rgba(255,152,72,0.2)', border: '1px solid rgba(255,152,72,0.5)'}}>
                  <span className="text-sm font-medium text-orange-200">🧭 AI-Powered Archaeological Discovery</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mt-4 pop-in">
                  Uncover Lost <span style={{color: '#ff9a48'}}>Civilizations</span>
                </h1>
                
                <p className="mt-6 text-lg md:text-xl text-gray-100 max-w-2xl leading-relaxed pop-in" style={{animationDelay: '120ms'}}>
                  Advanced AI reveals hidden archaeological sites from satellite imagery. Discover ancient structures, pathways, and settlements invisible to the human eye–accelerating research and preserving human heritage.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 pop-in" style={{animationDelay: '240ms'}}>
                  <a href="/upload" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                    <span>Start Mapping</span>
                    <span>→</span>
                  </a>
                  <a href="/explore" className="px-8 py-4 border-2 border-orange-400 hover:bg-orange-400/10 text-orange-100 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <span>🗺️</span>
                    <span>Explore Discoveries</span>
                  </a>
                </div>
              </div>

              {/* Right-side 3D-style cards */}
              <div className="hidden lg:flex lg:flex-col gap-6 w-full lg:w-96 z-10">
                <div className="relative" style={{animation: 'float-anim 4s ease-in-out infinite'}}>
                  <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 shadow-2xl transform rotate-1 hover:shadow-3xl transition-all duration-300 pop-in" style={{animationDelay: '400ms'}}>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm"><Leaf className="w-8 h-8 text-white" /></div>
                      <div>
                        <div className="text-white font-bold">Vegetation</div>
                        <div className="text-white/80 text-sm">YOLOv8 Segmentation</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative" style={{animation: 'float-anim 4s ease-in-out infinite', animationDelay: '0.3s'}}>
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-2xl transform -rotate-2 hover:shadow-3xl transition-all duration-300 pop-in" style={{animationDelay: '520ms'}}>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm"><Soil className="w-8 h-8 text-white" /></div>
                      <div>
                        <div className="text-white font-bold">Soil Detection</div>
                        <div className="text-white/80 text-sm">YOLOv11 Anomalies</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative" style={{animation: 'float-anim 4s ease-in-out infinite', animationDelay: '0.6s'}}>
                  <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-6 shadow-2xl transform rotate-2 hover:shadow-3xl transition-all duration-300 pop-in" style={{animationDelay: '640ms'}}>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm"><Brain className="w-8 h-8 text-white" /></div>
                      <div>
                        <div className="text-white font-bold">Soil Classifier</div>
                        <div className="text-white/80 text-sm">CNN Classification</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 pop-in">How Our Technology Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto pop-in" style={{animationDelay: '120ms'}}>A sophisticated pipeline of AI models and data processing to identify archaeological features.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: '1', title: 'AI Detection Engine', desc: 'Deep learning models trained on satellite imagery' },
              { number: '2', title: 'Multi-Spectral Analysis', desc: 'Processing visible, infrared, and thermal imagery bands' },
              { number: '3', title: 'Pattern Recognition', desc: 'Identifying maps, soil marks, and terrain anomalies' },
              { number: '4', title: 'Historical Database', desc: 'Cross-referencing with global archaeological records' },
            ].map((item, idx) => (
              <div key={idx} className="relative pop-in" style={{animationDelay: `${240 + idx * 120}ms`}}>
                <div className="bg-white rounded-xl border-2 border-gray-100 hover:border-orange-300 p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold mb-4">{item.number}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{background: 'linear-gradient(135deg, #ff9a48 0%, #ff7a3d 100%)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 pop-in">Ready to Uncover History?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto pop-in" style={{animationDelay: '120ms'}}>Upload your satellite or drone imagery and let our AI reveal hidden archaeological features beneath the surface.</p>
          <a href="/upload" className="inline-block px-10 py-4 bg-white text-orange-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 pop-in" style={{animationDelay: '240ms'}}>
            Upload Imagery
          </a>
        </div>
      </section>
    </div>
  )
}

export default Home
