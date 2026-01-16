import axios from 'axios'

// Configure axios to use backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000 // 2 minute timeout for processing
})

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  config => {
    console.log(`Calling ${API_BASE_URL}${config.url}`)
    return config
  },
  error => Promise.reject(error)
)

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      console.error('Network Error - Backend may not be running at', API_BASE_URL)
    }
    return Promise.reject(error)
  }
)

export default apiClient
