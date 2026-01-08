import api from '../api';

export async function searchPosts(query: string) {
  const response = await api.get(`/posts/search?q=${encodeURIComponent(query)}`);
  return response.data;
}
