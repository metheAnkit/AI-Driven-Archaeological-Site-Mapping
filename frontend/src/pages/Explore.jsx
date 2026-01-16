import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { MapPin } from '../components/Icons'

const Explore = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const [filteredSites, setFilteredSites] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)

  const getSiteImage = (siteName) => {
    const imageRotation = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1486299267070-83823e5ca538?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552520514-5fefe8c9ef14?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1577720643272-265f434884a3?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1587474260584-136574528ee0?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1591604129939-640da8ac8721?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1605662572650-fddf92d1b3a1?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1548013146-72f785b98ddb?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578926314433-c6e50a2e8ba0?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=400&fit=crop'
    ]
    const hash = siteName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return imageRotation[hash % imageRotation.length]
  }

  const searchArchaeologicalSites = async (query) => {
    if (!query.trim()) {
      setFilteredSites([])
      return
    }

    setLoading(true)
    try {
      // Use Wikipedia API to search for archaeological sites
      const response = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          srsearch: `${query} archaeological site`,
          srnamespace: 0,
          srlimit: 2,
          format: 'json',
          origin: '*'
        }
      })

      if (response.data.query.search && response.data.query.search.length > 0) {
        // Fetch images for each site
        const sitesWithImages = await Promise.all(
          response.data.query.search.map(async (item, index) => {
            let imageUrl = null
            try {
              // Get page info including main image
              const pageResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
                params: {
                  action: 'query',
                  titles: item.title,
                  prop: 'pageimages|pageterms',
                  pithumbsize: 400,
                  format: 'json',
                  origin: '*'
                }
              })
              
              const pages = pageResponse.data.query.pages
              const page = Object.values(pages)[0]
              if (page.thumbnail) {
                imageUrl = page.thumbnail.source
              }
            } catch (err) {
              console.error('Error fetching image:', err)
            }

            return {
              id: `result-${index}`,
              name: item.title,
              description: item.snippet.replace(/<[^>]*>/g, ''), // Remove HTML tags
              link: `https://en.wikipedia.org/wiki/${item.title.replace(/\s+/g, '_')}`,
              image: imageUrl || getSiteImage(item.title)
            }
          })
        )
        setFilteredSites(sitesWithImages)
      } else {
        setFilteredSites([])
      }
    } catch (error) {
      console.error('Error fetching sites:', error)
      setFilteredSites([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Debounce search
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const q = (searchQuery || '').trim()
      if (!q) {
        setFilteredSites([])
        setHasSearched(false)
        return
      }
      setHasSearched(true)
      searchArchaeologicalSites(q)
    }, 350)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-archai-orange-500 text-white rounded-3xl p-8 flex items-center gap-6">
            <div className="flex-shrink-0">
              <span className="text-5xl">🏛️</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Explore Sites</h1>
              <p className="text-xl text-archai-orange-100">
                Discover and explore archaeological sites from 2000+ verified sources
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <a href="https://en.wikipedia.org/wiki/List_of_archaeological_sites" target="_blank" rel="noreferrer" className="block hover:opacity-90 transition-opacity">
            <div className="bg-gradient-to-r from-archai-orange-500 to-archai-orange-600 text-white rounded-xl p-6 shadow flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm opacity-90">Archaeological sites from across the globe</p>
                <h2 className="text-3xl font-extrabold tracking-tight mt-1">3000+ Archaeological Sites</h2>
              </div>
            </div>
          </a>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search sites by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-archai-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Sites Grid - Only show after search */}
        {hasSearched && (
          <>
            {loading && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Searching archaeological sites...</p>
              </div>
            )}
            {!loading && filteredSites.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredSites.map((site) => (
                    <a
                      key={site.id}
                      href={site.link}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition cursor-pointer group"
                    >
                      <div className="h-40 bg-gray-100 flex items-center justify-center group-hover:opacity-90 transition overflow-hidden">
                        {site.image ? (
                          <img 
                            src={site.image} 
                            alt={site.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                            onError={(e) => {
                              e.target.src = getSiteImage(site.name)
                            }}
                          />
                        ) : (
                          <img 
                            src={getSiteImage(site.name)} 
                            alt={site.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-archai-orange-500 transition">{site.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{site.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  Showing {filteredSites.length} result{filteredSites.length !== 1 ? 's' : ''} found for your search.
                </div>
              </>
            ) : (
              !loading && <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No sites found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Explore
