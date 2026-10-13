import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message
      || (error.code === 'ECONNABORTED'
        ? 'サーバーからの応答がタイムアウトしました。'
        : 'サーバーに接続できません。起動状態を確認してください。')
    const apiError = new Error(message)
    apiError.status = error.response?.status
    return Promise.reject(apiError)
  },
)
