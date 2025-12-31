import api from './api';

// Deleta um post
// DELETE http://localhost:3000/posts/:id

export async function deletePost(id: number) {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
}
