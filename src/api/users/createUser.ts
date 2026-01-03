import api from '../api';

export async function createUser(data: {
  nome: string;
  email: string;
  senha: string;
  admin: boolean;
}) {
  const response = await api.post('/users', {
    nome: data.nome,
    email: data.email,
    senha: data.senha,
    admin: data.admin
  });
  
  return response.data;
}
