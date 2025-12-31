import api from './api';

// Busca um post específico por ID
// GET http://localhost:3000/posts/:id

export async function getPostById(id: number) {
  const response = await api.get(`/posts/${id}`);
  return response.data;
}
