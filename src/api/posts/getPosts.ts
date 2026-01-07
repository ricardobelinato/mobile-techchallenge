import api from '../api';

export async function getPosts(search?:string) {
  const response = await api.get(`/posts?q=${search}`);
  return response.data;
}