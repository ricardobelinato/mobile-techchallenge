import api from '../api';

export async function getPostById(id: number) {
  const response = await api.get(`/posts/${id}`);
  return response.data;
}
