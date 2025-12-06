import api from './api';

export async function auth(email: string, senha: string) {
    const response = await api.post("/auth/login", { email, senha });
    return response.data;
}
