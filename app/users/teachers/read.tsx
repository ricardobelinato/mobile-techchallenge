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

export default function ProfessoresScreen() {
  const [auth, setAuth] = useState(null);
  const [professores, setProfessores] = useState([]);
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
    fetchProfessores();
  }, []);

  const confirmarRemocao = (professor) => {
    if (Platform.OS === "web") {
      const confirmado = window.confirm(
        `Deseja realmente remover o professor "${professor.nome}"?\n\nEsta ação não pode ser desfeita.`
      );

      if (confirmado) {
        removerProfessor(professor.id);
      }
      return;
    }

    Alert.alert(
      "Confirmar Remoção",
      `Deseja realmente remover o professor "${professor.nome}"?\n\nEsta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removerProfessor(professor.id),
        },
      ]
    );
  };

  const removerProfessor = async (professorId) => {
    try {
      await deleteUser(professorId);
      
      if (Platform.OS === "web") {
        alert("Professor removido com sucesso!");
      } else {
        Alert.alert("Sucesso", "Professor removido com sucesso!");
      }
      
      fetchProfessores();
    } catch (error) {
      console.error("Erro ao remover professor:", error);
      
      if (Platform.OS === "web") {
        alert("Não foi possível remover o professor. Tente novamente.");
      } else {
        Alert.alert("Erro", "Não foi possível remover o professor. Tente novamente.");
      }
    }
  };

  const renderizaProfessor = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={50} color="#024886" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.professorNome}>{item.nome}</Text>
        <Text style={styles.professorEmail}>{item.email}</Text>

        {item.data_criacao && (
          <Text style={styles.dataCriacao}>
            Cadastrado em: {new Date(item.data_criacao).toLocaleDateString('pt-BR')}
          </Text>
        )}
        
        <View style={styles.botoesContainer}>
          {auth?.user?.admin && (
            <Pressable
              style={({ pressed }) => [styles.botaoEditar, pressed && { opacity: 0.7 }]}
              onPress={() => router.push({
                pathname: "/users/teachers/update",
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

  async function fetchProfessores() {
    try {
      setLoading(true);
      const data = await getUsers();

      // Filtra apenas professores (admin: true)
      const professoresFiltrados = Array.isArray(data) 
        ? data.filter(user => user.admin)
        : [];

      setProfessores(professoresFiltrados);
    } catch (err) {
      console.error("Erro ao buscar professores:", err);
      setProfessores([]);
    } finally {
      setLoading(false);
    }
  }

  const limparBusca = () => {
    setBusca("");
  };

  const professoresFiltrados = professores.filter(professor => {
    return !busca || 
      professor.nome.toLowerCase().includes(busca.toLowerCase()) ||
      professor.email.toLowerCase().includes(busca.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="people" size={28} color="#024886" />
          <Text style={styles.headerTitle}>Professores</Text>
        </View>
        
        {auth?.user?.admin && (
          <Pressable
            style={styles.botaoNovo}
            onPress={() => router.push("/users/teachers/create")}
          >
            <Ionicons name="add-circle" size={20} color="#024886" />
            <Text style={styles.textoBotaoNovo}>Novo Professor</Text>
          </Pressable>
        )}
      </View>

      {/* CONTADOR */}
      <View style={styles.contadorContainer}>
        <Text style={styles.contadorTexto}>
          {professoresFiltrados.length} {professoresFiltrados.length === 1 ? 'professor cadastrado' : 'professores cadastrados'}
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
        data={professoresFiltrados}
        renderItem={renderizaProfessor}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="school-outline" size={80} color="#CCC" />
            <Text style={styles.emptyText}>
              {loading ? "Carregando professores..." : "Nenhum professor cadastrado"}
            </Text>
            {!loading && auth?.user?.admin && (
              <Text style={styles.emptySubtext}>
                Clique em "Novo Professor" para cadastrar
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

  professorNome: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1d1d1d',
    marginBottom: 4,
  },

  professorEmail: { 
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
