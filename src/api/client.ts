import axios from 'axios'
import type { ApiErrorBody } from '../types/api'
import { ApiError } from '../types/api'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      return Promise.reject(new ApiError(error.response.data as ApiErrorBody))
    }
    return Promise.reject(error)
  },
)

export default apiClient
