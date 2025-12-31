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

type User = {
  id: number;
  nome: string;
  email: string;
  admin: boolean;
};

type AuthData = {
  token: string;
  user: User;
};

type PostUser = {
  id: number;
  nome: string;
  email: string;
};

type Post = {
  id: number;
  titulo: string;
  conteudo: string;
  imagem: string | null;
  usuario_id: number;
  materia: string;
  data_criacao: string;
  data_atualizacao: string;
  Usuario: PostUser;
};

export default function HomeScreen() {
  const [auth, setAuth] = useState<AuthData | null>(null);
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

  const confirmarRemocao = (post: Post) => {
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
