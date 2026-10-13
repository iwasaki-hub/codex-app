import { apiClient } from '../../lib/apiClient.js'

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}

export const postsApi = {
  list: async (token) => (
    await apiClient.get('/posts', token ? { headers: authHeaders(token) } : undefined)
  ).data,
  create: async (token, payload) => (
    await apiClient.post('/posts', payload, { headers: authHeaders(token) })
  ).data,
  updateVisibility: async (token, postId, isPublished) => (
    await apiClient.patch(
      `/posts/${encodeURIComponent(postId)}/visibility`,
      { isPublished },
      { headers: authHeaders(token) },
    )
  ).data,
}
