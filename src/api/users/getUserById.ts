 import api from '../api';

export async function getUserById(id: number) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}
