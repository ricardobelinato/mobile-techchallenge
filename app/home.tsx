// import { Ionicons } from '@expo/vector-icons';
// import { router } from "expo-router";
// import React, { useEffect, useState } from 'react';
// import {
//   Alert,
//   FlatList,
//   Image,
//   Modal,
//   Platform,
//   Pressable,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View
// } from 'react-native';
// import { deletePost } from '../src/api/deletePost';
// import { getPosts } from '../src/api/getPosts';
// import { getAuth } from '../src/storage/authStorage';

// export default function HomeScreen() {
//   const [auth, setAuth] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [postSelecionado, setPostSelecionado] = useState(null);
//   const [busca, setBusca] = useState("");

//   useEffect(() => {
//     let mounted = true;

//     (async () => {
//       const data = await getAuth();
//       if (mounted) setAuth(data);
//     })();

//     return () => { mounted = false };
//   }, []);

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const abrirModal = (post) => {
//     setPostSelecionado(post);
//     setModalVisible(true);
//   };

//   const fecharModal = () => {
//     setModalVisible(false);
//     setPostSelecionado(null);
//   };

//   const confirmarRemocao = (post) => {
//     if (Platform.OS === "web") {
//       const confirmado = window.confirm(
//         `Deseja realmente remover o post "${post.titulo}"?\n\nEsta ação não pode ser desfeita.`
//       );

//       if (confirmado) {
//         removerPost(post.id);
//       }
//       return;
//     }

//     Alert.alert(
//       "Confirmar Remoção",
//       `Deseja realmente remover o post "${post.titulo}"?\n\nEsta ação não pode ser desfeita.`,
//       [
//         { text: "Cancelar", style: "cancel" },
//         {
//           text: "Remover",
//           style: "destructive",
//           onPress: () => removerPost(post.id),
//         },
//       ]
//     );
//   };

//   const removerPost = async (postId) => {
//     try {
//       await deletePost(postId);
//       Alert.alert("Sucesso", "Post removido com sucesso!");
//       // Recarrega a lista após remover
//       fetchPosts(busca);
//     } catch (error) {
//       console.error("Erro ao remover post:", error);
//       Alert.alert("Erro", "Não foi possível remover o post. Tente novamente.");
//     }
//   };

//   const renderizaPost = ({ item }) => (
//     <View style={styles.card}>
//       <Image
//         source={{ uri: getPostImage(item) }}
//         style={styles.cardImage}
//       />

//       <View style={{ flex: 1 }}>
//         <Text style={styles.postTitulo}>{item.titulo}</Text>

//         {item.materia && (
//           <Text style={styles.materia}>{item.materia}</Text>
//         )}

//         <Text style={styles.descricao}>
//           {item.conteudo.length > 80 
//             ? item.conteudo.substring(0, 80) + "..." 
//             : item.conteudo}
//         </Text>
        
//         <View style={styles.botoesContainer}>
//           <Pressable
//             style={({ pressed }) => [styles.botao, pressed && { opacity: 0.7 }]}
//             onPress={() => abrirModal(item)}
//           >
//             <Text style={styles.textoBotao}>Ler post</Text>
//           </Pressable>

//           {/* Botão Editar - só aparece para admin */}
//           {auth?.user?.admin && (
//             <Pressable
//               style={({ pressed }) => [styles.botaoEditar, pressed && { opacity: 0.7 }]}
//               onPress={() => router.push({
//                 pathname: "/post/update",
//                 params: { id: item.id }
//               })}
//             >
//               <Text style={styles.textoBotaoEditar}>Editar</Text>
//             </Pressable>
//           )}

//           {/* Botão Remover - só aparece para admin */}
//           {auth?.user?.admin && (
//             <Pressable
//               style={({ pressed }) => [styles.botaoRemover, pressed && { opacity: 0.7 }]}
//               onPress={() => confirmarRemocao(item)}
//             >
//               <Text style={styles.textoBotaoRemover}>Remover</Text>
//             </Pressable>
//           )}
//         </View>
//       </View>
//     </View>
//   );

//   async function fetchPosts(query?: string) {
//     try {
//       setLoading(true);
//       const data = await getPosts(query);

//       if (Array.isArray(data)) {
//         setPosts(data);
//       } else if (data) {
//         setPosts([data]);
//       } else {
//         setPosts([]);
//       }
//     } catch (err) {
//       console.error("Erro ao buscar posts:", err);
//       setPosts([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const limparBusca = () => {
//     setBusca("");
//     fetchPosts();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* BARRA DE PESQUISA */}
//       <View style={styles.searchBox}>
//         <Ionicons name="search" size={22} color="#666" style={{ marginRight: 8 }} />
//         <TextInput
//           placeholder="Buscar post por título ou matéria..."
//           placeholderTextColor="#777"
//           style={styles.searchInput}
//           value={busca}
//           onChangeText={setBusca}
//           onSubmitEditing={() => fetchPosts(busca)}
//           returnKeyType='search'
//         />
//         {busca !== "" && (
//           <Pressable onPress={limparBusca}>
//             <Ionicons name="close-circle" size={22} color="#666" />
//           </Pressable>
//         )}
//       </View>

//       {/* LISTA */}
//       <FlatList
//         data={posts}
//         renderItem={renderizaPost}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.list}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <Text style={styles.nenhumResultado}>
//             {loading ? "Carregando..." : "Nenhum post encontrado..."}
//           </Text>
//         }
//       />

//       {/* MODAL */}
//       <Modal visible={modalVisible} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalBox}>
//             <ScrollView showsVerticalScrollIndicator={false}>
//               {postSelecionado && (
//                 <Image
//                   source={{ uri: getPostImage(postSelecionado) }}
//                   style={styles.modalImage}
//                 />
//               )}

//               <Text style={styles.modalTitulo}>{postSelecionado?.titulo}</Text>

//               {postSelecionado?.materia && (
//                 <Text style={styles.modalMateria}>{postSelecionado?.materia}</Text>
//               )}

//               {postSelecionado?.Usuario?.nome && (
//                 <Text style={styles.modalAutor}>
//                   Por: {postSelecionado.Usuario.nome}
//                 </Text>
//               )}

//               <Text style={styles.modalConteudo}>{postSelecionado?.conteudo}</Text>

//               {/* Botão Editar no Modal - só aparece para admin */}
//               {auth?.user?.admin && postSelecionado && (
//                 <Pressable
//                   style={styles.botaoEditarModal}
//                   onPress={() => {
//                     fecharModal();
//                     router.push({
//                       pathname: "/post/update",
//                       params: { id: postSelecionado.id }
//                     });
//                   }}
//                 >
//                   <Text style={styles.textoEditarModal}>Editar post</Text>
//                 </Pressable>
//               )}
//             </ScrollView>

//             <Pressable style={styles.botaoFechar} onPress={fecharModal}>
//               <Text style={styles.botaoFecharTexto}>Fechar</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// function getPostImage(post) {
//   if (post.imagem) return post.imagem;
//   return `https://picsum.photos/seed/post-${post.id ?? Math.random()}/600/400`;
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f3f5f7' },

//   searchBox: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF',
//     margin: 16,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     borderRadius: 14,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.03,
//     shadowRadius: 5,
//     elevation: 2
//   },

//   searchInput: { flex: 1, fontSize: 16, color: '#333' },

//   list: { paddingHorizontal: 18, paddingBottom: 30 },

//   nenhumResultado: {
//     textAlign: 'center',
//     color: '#666',
//     marginTop: 20,
//     fontSize: 15
//   },

//   card: {
//     backgroundColor: '#FFF',
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.04,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 3,
//   },

//   cardImage: { width: '100%', height: 170, borderRadius: 12, marginBottom: 12 },

//   postTitulo: { fontSize: 19, fontWeight: '700', color: '#1d1d1d' },

//   materia: {
//     backgroundColor: '#02488622',
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderRadius: 8,
//     alignSelf: 'flex-start',
//     fontSize: 12,
//     color: '#024886',
//     marginTop: 6,
//     marginBottom: 8
//   },

//   descricao: { color: '#555', fontSize: 14, marginBottom: 12 },

//   botoesContainer: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 10,
//     flexWrap: 'wrap',
//   },

//   botao: {
//     backgroundColor: '#024886',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//   },

//   textoBotao: { color: '#fff', fontSize: 14, fontWeight: '600' },

//   botaoEditar: {
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: '#F39C12',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//   },

//   textoBotaoEditar: { color: '#F39C12', fontSize: 14, fontWeight: '600' },
  
//   botaoRemover: {
//     backgroundColor: "transparent",
//     borderWidth: 1,
//     borderColor: '#C0392B',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//   },

//   textoBotaoRemover: { color: '#C0392B', fontSize: 14, fontWeight: '600' },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.45)',
//     justifyContent: 'center',
//     padding: 20
//   },

//   modalBox: {
//     backgroundColor: '#FFF',
//     borderRadius: 20,
//     padding: 18,
//     maxHeight: '85%',
//   },

//   modalImage: { width: '100%', height: 220, borderRadius: 14, marginBottom: 15 },

//   modalTitulo: { fontSize: 23, fontWeight: '700', marginBottom: 10, color: '#024886' },

//   modalMateria: {
//     backgroundColor: '#02488622',
//     paddingVertical: 5,
//     paddingHorizontal: 12,
//     alignSelf: 'flex-start',
//     borderRadius: 8,
//     fontSize: 13,
//     marginBottom: 10,
//     color: '#024886'
//   },

//   modalAutor: {
//     fontSize: 14,
//     color: '#666',
//     fontStyle: 'italic',
//     marginBottom: 14,
//   },

//   modalConteudo: {
//     fontSize: 16,
//     color: '#333',
//     lineHeight: 24,
//     marginBottom: 20
//   },

//   botaoEditarModal: {
//     backgroundColor: '#F39C12',
//     paddingVertical: 12,
//     borderRadius: 12,
//     marginBottom: 18
//   },

//   textoEditarModal: {
//     textAlign: 'center',
//     color: '#FFF',
//     fontWeight: '700',
//     fontSize: 16
//   },

//   botaoFechar: {
//     backgroundColor: '#279951',
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginTop: 10
//   },

//   botaoFecharTexto: {
//     color: '#FFF',
//     fontSize: 16,
//     textAlign: 'center',
//     fontWeight: '600'
//   },
// });

import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { deletePost } from '../src/api/deletePost';
import { getPosts } from '../src/api/getPosts';
import { getAuth } from '../src/storage/authStorage';

export default function HomeScreen() {
  const [auth, setAuth] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      const data = await getAuth();
      if (mounted) setAuth(data);
    })();

    return () => { mounted = false };
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const confirmarRemocao = (post) => {
    if (Platform.OS === "web") {
      const confirmado = window.confirm(
        `Deseja realmente remover o post "${post.titulo}"?\n\nEsta ação não pode ser desfeita.`
      );

      if (confirmado) {
        removerPost(post.id);
      }
      return;
    }

    Alert.alert(
      "Confirmar Remoção",
      `Deseja realmente remover o post "${post.titulo}"?\n\nEsta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removerPost(post.id),
        },
      ]
    );
  };

  const removerPost = async (postId) => {
    try {
      await deletePost(postId);
      
      if (Platform.OS === "web") {
        alert("Post removido com sucesso!");
      } else {
        Alert.alert("Sucesso", "Post removido com sucesso!");
      }
      
      fetchPosts(busca);
    } catch (error) {
      console.error("Erro ao remover post:", error);
      
      if (Platform.OS === "web") {
        alert("Não foi possível remover o post. Tente novamente.");
      } else {
        Alert.alert("Erro", "Não foi possível remover o post. Tente novamente.");
      }
    }
  };

  const renderizaPost = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: getPostImage(item) }}
        style={styles.cardImage}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.postTitulo}>{item.titulo}</Text>

        {item.materia && (
          <Text style={styles.materia}>{item.materia}</Text>
        )}

        <Text style={styles.descricao}>
          {item.conteudo.length > 80 
            ? item.conteudo.substring(0, 80) + "..." 
            : item.conteudo}
        </Text>
        
        <View style={styles.botoesContainer}>
          {/* Botão Ler Post */}
          <Pressable
            style={({ pressed }) => [styles.botao, pressed && { opacity: 0.7 }]}
            onPress={() => router.push({
              pathname: "/post/read",
              params: { id: item.id }
            })}
          >
            <Text style={styles.textoBotao}>Ler post</Text>
          </Pressable>

          {/* Botão Editar - só aparece para admin */}
          {auth?.user?.admin && (
            <Pressable
              style={({ pressed }) => [styles.botaoEditar, pressed && { opacity: 0.7 }]}
              onPress={() => router.push({
                pathname: "/post/update",
                params: { id: item.id }
              })}
            >
              <Text style={styles.textoBotaoEditar}>Editar</Text>
            </Pressable>
          )}

          {/* Botão Remover - só aparece para admin */}
          {auth?.user?.admin && (
            <Pressable
              style={({ pressed }) => [styles.botaoRemover, pressed && { opacity: 0.7 }]}
              onPress={() => confirmarRemocao(item)}
            >
              <Text style={styles.textoBotaoRemover}>Remover</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );

  async function fetchPosts(query?: string) {
    try {
      setLoading(true);
      const data = await getPosts(query);

      if (Array.isArray(data)) {
        setPosts(data);
      } else if (data) {
        setPosts([data]);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("Erro ao buscar posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  const limparBusca = () => {
    setBusca("");
    fetchPosts();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* BARRA DE PESQUISA */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={22} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Buscar post por título ou matéria..."
          placeholderTextColor="#777"
          style={styles.searchInput}
          value={busca}
          onChangeText={setBusca}
          onSubmitEditing={() => fetchPosts(busca)}
          returnKeyType='search'
        />
        {busca !== "" && (
          <Pressable onPress={limparBusca}>
            <Ionicons name="close-circle" size={22} color="#666" />
          </Pressable>
        )}
      </View>

      {/* LISTA */}
      <FlatList
        data={posts}
        renderItem={renderizaPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.nenhumResultado}>
            {loading ? "Carregando..." : "Nenhum post encontrado..."}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

function getPostImage(post) {
  if (post.imagem) return post.imagem;
  return `https://picsum.photos/seed/post-${post.id ?? Math.random()}/600/400`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f5f7' },

  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2
  },

  searchInput: { flex: 1, fontSize: 16, color: '#333' },

  list: { paddingHorizontal: 18, paddingBottom: 30 },

  nenhumResultado: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 15
  },

  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  cardImage: { width: '100%', height: 170, borderRadius: 12, marginBottom: 12 },

  postTitulo: { fontSize: 19, fontWeight: '700', color: '#1d1d1d' },

  materia: {
    backgroundColor: '#02488622',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    fontSize: 12,
    color: '#024886',
    marginTop: 6,
    marginBottom: 8
  },

  descricao: { color: '#555', fontSize: 14, marginBottom: 12 },

  botoesContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    flexWrap: 'wrap',
  },

  botao: {
    backgroundColor: '#024886',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  textoBotao: { color: '#fff', fontSize: 14, fontWeight: '600' },

  botaoEditar: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F39C12',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  textoBotaoEditar: { color: '#F39C12', fontSize: 14, fontWeight: '600' },
  
  botaoRemover: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: '#C0392B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  textoBotaoRemover: { color: '#C0392B', fontSize: 14, fontWeight: '600' },
});
