import { apiClient } from '../../lib/apiClient.js'

export const authApi = {
  register: async (payload) => (await apiClient.post('/auth/register', payload)).data,
  login: async (payload) => (await apiClient.post('/auth/login', payload)).data,
  currentUser: async (token) => (
    await apiClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data,
}
