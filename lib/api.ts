import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig
} from 'axios'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000'

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
let pendingRequests: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

function resolvePending(token: string) {
  pendingRequests.forEach((p) => p.resolve(token))
  pendingRequests = []
}

function rejectPending(error: any) {
  pendingRequests.forEach((p) => p.reject(error))
  pendingRequests = []
}

function clearTokensAndRedirect() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  delete api.defaults.headers.common['Authorization']

  if (
    typeof window !== 'undefined' &&
    !window.location.pathname.startsWith('/auth') &&
    window.location.pathname !== '/'
  ) {
    window.location.href = '/auth/login'
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const skipRetry =
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/me')

    if (skipRetry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          },
          reject,
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshToken = localStorage.getItem('refresh_token')

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await axios.post(
        `${API_URL}/api/auth/refresh`,
        { refresh_token: refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      )

      const { access_token, refresh_token } = response.data

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      resolvePending(access_token)

      originalRequest.headers.Authorization = `Bearer ${access_token}`
      return api(originalRequest)
    } catch (refreshError) {
      rejectPending(refreshError)
      clearTokensAndRedirect()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
