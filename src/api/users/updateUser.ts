 import api from '../api';

export async function updateUser(id: number, data: {
    nome: string;
    email: string;
    senha: string;
    admin: boolean;
}) {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
}
