 import api from '../api';

export async function updatePost(id: number, data: {
    nome: string;
    email: string;
    senha: string;
    admin: boolean;
}) {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
}
