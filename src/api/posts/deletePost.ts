import api from '../api';

export async function deletePost(id: number) {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
}
