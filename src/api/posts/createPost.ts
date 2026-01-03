import api from '../api';

export async function createPost(data: {
  titulo: string;
  conteudo: string;
  usuario_id: number | string;
//   materia?: string;
//   imagem?: string;
}) {
  const formData = new FormData();
  formData.append('titulo', data.titulo);
  formData.append('conteudo', data.conteudo);
  formData.append('usuario_id', String(data.usuario_id));
  
//   if (data.materia) {
//     formData.append('materia', data.materia);
//   }
  
//   if (data.imagem) {
//     formData.append('imagem', data.imagem);
//   }

  const response = await api.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  
  return response.data;
}
