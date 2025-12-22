import api from './api';

// Retorna todos os posts = http://localhost:3000/posts
// Busca Id do post = http://localhost:3000/posts/1
// Busca posts = http://localhost:3000/posts/search?q=exemplo

export async function getPosts(params: {}) {
    const response = await api.get('/posts', { params });
    return response.data;
}
