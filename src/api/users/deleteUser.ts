import api from '../api';

export async function deleteUser(id: number) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}
