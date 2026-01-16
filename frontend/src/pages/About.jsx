import React, { useEffect } from 'react'
import { Leaf, Soil, Brain } from '../components/Icons'

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl" style={{background: 'linear-gradient(135deg, #6b4423 0%, #4a2f1a 100%)'}}>
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-40 h-40 rounded-full" style={{background: 'radial-gradient(circle, rgba(255,152,72,0.3) 0%, transparent 70%)'}}></div>
              <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full" style={{background: 'radial-gradient(circle, rgba(255,152,72,0.2) 0%, transparent 70%)'}}></div>
            </div>

            <div className="relative p-8 md:p-16 text-white z-10">
              <div className="inline-block mb-4 px-3 py-1 rounded-full" style={{background: 'rgba(255,152,72,0.2)', border: '1px solid rgba(255,152,72,0.5)'}}>
                <span className="text-sm font-medium text-orange-200">⚱️ Archaeological Innovation</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 pop-in">
                Revolutionizing <span style={{color: '#ff9a48'}}>Archaeological</span> Discovery
              </h1>

              <p className="text-lg text-gray-100 max-w-3xl leading-relaxed pop-in" style={{animationDelay: '120ms'}}>
                ArchaiMap combines cutting-edge artificial intelligence with satellite imagery to uncover hidden archaeological sites across the globe, transforming how we discover and preserve shared human heritage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="pop-in">
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-orange-100">
                <span className="text-orange-700 text-sm font-semibold">🗺️ Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Unlocking Hidden Civilizations</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Traditional archaeological surveys cover only a fraction of the Earth's surface. Countless sites remain hidden beneath vegetation, sand, and soil—invisible to the human eye.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                By analyzing satellite and drone imagery with advanced AI, we identify potential archaeological features invisible to the human eye—detecting subtle variations in soil color, vegetation patterns, and terrain that often signal buried structures. This accelerates research, protects cultural heritage, and democratizes archaeological discovery.
              </p>
            </div>

            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl pop-in" style={{animationDelay: '240ms'}}>
              <img src="/archaeological-site.jpg" alt="Archaeological site discovery" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Technology Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 pop-in">Our Technology</h2>
            <p className="text-lg text-gray-600 pop-in" style={{animationDelay: '120ms'}}>Integrated AI models working in harmony to detect archaeological features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="relative pop-in" style={{animationDelay: '240ms'}}>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-300 h-full">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 mb-6">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Vegetation Segmentation</h3>
                <p className="text-gray-700 mb-4">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-2">YOLOv8</span>
                </p>
                <p className="text-gray-600">
                  Analyzes vegetation distribution to identify crop marks, discoloration, and stress patterns that often form above buried ruins or structures.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative pop-in" style={{animationDelay: '360ms'}}>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-300 h-full">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mb-6">
                  <Soil className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Soil Anomaly Detection</h3>
                <p className="text-gray-700 mb-4">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-2">YOLOv11</span>
                </p>
                <p className="text-gray-600">
                  Detects unusual soil colors, textures, and formations that might signal archaeological features such as ditches, trenches, or filled-in structures.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative pop-in" style={{animationDelay: '480ms'}}>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-300 h-full">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 mb-6">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Soil Type Classification</h3>
                <p className="text-gray-700 mb-4">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-2">CNN</span>
                </p>
                <p className="text-gray-600">
                  Classifies major soil types—red, clay, black, and alluvial—based on trained models to inform excavation planning and site analysis.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 md:p-12 pop-in" style={{animationDelay: '600ms'}}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Excellence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-orange-600">✓</span> Model Performance & Training
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Each of our advanced machine learning models is meticulously trained on curated datasets that have been standardized to 640×640 pixel resolution. We employ rigorous evaluation methodologies including precision, recall, F1-score metrics, and mean Average Precision (mAP) calculations to ensure comprehensive reliability and exceptional accuracy across all detection and classification tasks. Our models undergo continuous validation and improvement cycles to maintain peak performance standards.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-orange-600">✓</span> Comprehensive Technology Stack
                </h4>
                <div className="text-gray-700 text-sm leading-relaxed space-y-2">
                  <p><strong>Frontend Architecture:</strong> React with Tailwind CSS for responsive, modern interfaces</p>
                  <p><strong>Backend Infrastructure:</strong> FastAPI for high-performance API services</p>
                  <p><strong>AI & Deep Learning:</strong> PyTorch and TensorFlow frameworks powering our YOLOv8 and YOLOv11 models</p>
                  <p><strong>Data Processing:</strong> Integration with Google Earth Pro and Roboflow for premium satellite imagery and dataset management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
