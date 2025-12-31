import api from './api';

// Atualiza um post existente
// PUT http://localhost:3000/posts/:id
// Body: { titulo: string, descricao: string }

export async function updatePost(id: number, data: {
  titulo: string;
  conteudo: string;
}) {
  const response = await api.put(`/posts/${id}`, data);
  return response.data;
}
