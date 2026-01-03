import api from '../api';

export async function updatePost(id: number, data: {
  titulo: string;
  conteudo: string;
}) {
  const response = await api.put(`/posts/${id}`, data);
  return response.data;
}
