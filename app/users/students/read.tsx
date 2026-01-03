import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { deleteUser } from '../../../src/api/users/deleteUser';
import { getUsers } from '../../../src/api/users/getUsers';
import { getAuth } from '../../../src/storage/authStorage';

export default function AlunosScreen() {
  const [auth, setAuth] = useState(null);
  const [alunos, setAlunos] = useState([]);
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
    fetchAlunos();
  }, []);

  const confirmarRemocao = (aluno) => {
    if (Platform.OS === "web") {
      const confirmado = window.confirm(
        `Deseja realmente remover o aluno "${aluno.nome}"?\n\nEsta ação não pode ser desfeita.`
      );

      if (confirmado) {
        removerAluno(aluno.id);
      }
      return;
    }

    Alert.alert(
      "Confirmar Remoção",
      `Deseja realmente remover o aluno "${aluno.nome}"?\n\nEsta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removerAluno(aluno.id),
        },
      ]
    );
  };

  const removerAluno = async (alunoId) => {
    try {
      await deleteUser(alunoId);
      
      if (Platform.OS === "web") {
        alert("Aluno removido com sucesso!");
      } else {
        Alert.alert("Sucesso", "Aluno removido com sucesso!");
      }
      
      fetchAlunos();
    } catch (error) {
      console.error("Erro ao remover aluno:", error);
      
      if (Platform.OS === "web") {
        alert("Não foi possível remover o aluno. Tente novamente.");
      } else {
        Alert.alert("Erro", "Não foi possível remover o aluno. Tente novamente.");
      }
    }
  };

  const renderizaAluno = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={50} color="#024886" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.alunoNome}>{item.nome}</Text>
        <Text style={styles.alunoEmail}>{item.email}</Text>

        {item.data_criacao && (
          <Text style={styles.dataCriacao}>
            Cadastrado em: {new Date(item.data_criacao).toLocaleDateString('pt-BR')}
          </Text>
        )}
        
        <View style={styles.botoesContainer}>
          <Pressable
            style={({ pressed }) => [styles.botaoVer, pressed && { opacity: 0.7 }]}
            onPress={() => router.push({
              pathname: "/alunos/read",
              params: { id: item.id }
            })}
          >
            <Ionicons name="eye" size={16} color="#fff" />
            <Text style={styles.textoBotaoVer}>Ver</Text>
          </Pressable>

          {auth?.user?.admin && (
            <Pressable
              style={({ pressed }) => [styles.botaoEditar, pressed && { opacity: 0.7 }]}
              onPress={() => router.push({
                pathname: "/users/students/update",
                params: { id: item.id }
              })}
            >
              <Ionicons name="create-outline" size={16} color="#F39C12" />
              <Text style={styles.textoBotaoEditar}>Editar</Text>
            </Pressable>
          )}

          {auth?.user?.admin && (
            <Pressable
              style={({ pressed }) => [styles.botaoRemover, pressed && { opacity: 0.7 }]}
              onPress={() => confirmarRemocao(item)}
            >
              <Ionicons name="trash-outline" size={16} color="#C0392B" />
              <Text style={styles.textoBotaoRemover}>Remover</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );

  async function fetchAlunos() {
    try {
      setLoading(true);
      const data = await getUsers();

      // Filtra apenas alunos (admin: false)
      const alunosFiltrados = Array.isArray(data) 
        ? data.filter(user => !user.admin) 
        : [];

      setAlunos(alunosFiltrados);
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
      setAlunos([]);
    } finally {
      setLoading(false);
    }
  }

  const limparBusca = () => {
    setBusca("");
  };

  const alunosFiltrados = alunos.filter(aluno => {
    return !busca || 
      aluno.nome.toLowerCase().includes(busca.toLowerCase()) ||
      aluno.email.toLowerCase().includes(busca.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="people" size={28} color="#024886" />
          <Text style={styles.headerTitle}>Alunos</Text>
        </View>
        
        {auth?.user?.admin && (
          <Pressable
            style={styles.botaoNovo}
            onPress={() => router.push("/users/students/create")}
          >
            <Ionicons name="add-circle" size={20} color="#024886" />
            <Text style={styles.textoBotaoNovo}>Novo Aluno</Text>
          </Pressable>
        )}
      </View>

      {/* CONTADOR */}
      <View style={styles.contadorContainer}>
        <Text style={styles.contadorTexto}>
          {alunosFiltrados.length} {alunosFiltrados.length === 1 ? 'aluno cadastrado' : 'alunos cadastrados'}
        </Text>
      </View>

      {/* BARRA DE PESQUISA */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={22} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Buscar por nome ou email..."
          placeholderTextColor="#777"
          style={styles.searchInput}
          value={busca}
          onChangeText={setBusca}
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
        data={alunosFiltrados}
        renderItem={renderizaAluno}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="school-outline" size={80} color="#CCC" />
            <Text style={styles.emptyText}>
              {loading ? "Carregando alunos..." : "Nenhum aluno cadastrado"}
            </Text>
            {!loading && auth?.user?.admin && (
              <Text style={styles.emptySubtext}>
                Clique em "Novo Aluno" para cadastrar
              </Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f5f7' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#024886',
  },

  botaoNovo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#024886',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },

  textoBotaoNovo: {
    color: '#024886',
    fontSize: 14,
    fontWeight: '600',
  },

  contadorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E3F2FD',
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
  },

  contadorTexto: {
    fontSize: 14,
    color: '#024886',
    fontWeight: '600',
  },

  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    margin: 16,
    marginBottom: 8,
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

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  avatarContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },

  alunoNome: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1d1d1d',
    marginBottom: 4,
  },

  alunoEmail: { 
    fontSize: 14, 
    color: '#666',
    marginBottom: 6,
  },

  dataCriacao: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },

  botoesContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },

  botaoVer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#024886',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },

  textoBotaoVer: { color: '#fff', fontSize: 13, fontWeight: '600' },

  botaoEditar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F39C12',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },

  textoBotaoEditar: { color: '#F39C12', fontSize: 13, fontWeight: '600' },
  
  botaoRemover: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: '#C0392B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },

  textoBotaoRemover: { color: '#C0392B', fontSize: 13, fontWeight: '600' },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    fontWeight: '500',
  },

  emptySubtext: {
    fontSize: 14,
    color: '#BBB',
    marginTop: 8,
  },
});
