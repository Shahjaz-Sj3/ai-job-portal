import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  console.debug('[api:request]', config.method?.toUpperCase(), config.url)
  return config
})

api.interceptors.response.use(
  (response) => {
    console.debug('[api:response]', response.config.url, response.status)
    return response
  },
  (error) => {
    console.error('[api:error]', error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export default api
