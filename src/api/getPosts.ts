import api from './api';

export async function getPosts(param?: string | number) {
  let endpoint = "/posts";
  let params;

  if (param !== undefined && param !== "") {
    if (!isNaN(Number(param))) {
      // Busca por ID específico
      endpoint = `/posts/${Number(param)}`;
    } else {
      // Busca por texto
      endpoint = "/posts/search";
      params = { q: param };
    }
  }

  const response = await api.get(endpoint, { params });
  return response.data;
}
