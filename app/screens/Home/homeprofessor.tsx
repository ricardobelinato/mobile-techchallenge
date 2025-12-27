import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

// Tipo para os posts
type Post = {
  id: string;
  autor: string;
  data: string;
  conteudo: string;
};

export default function PostsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { aulaId, titulo, professor, descricao } = params;

  // Estado para gerenciar os posts
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      autor: `Prof. ${professor}`,
      data: '10/12/2024',
      conteudo: `Bem-vindos à aula de ${titulo}! Aqui vocês encontrarão todo o material necessário para acompanhar o curso.`,
    },
    {
      id: '2',
      autor: 'Aluno - João Silva',
      data: '09/12/2024',
      conteudo: 'Estou com uma dúvida sobre o conteúdo da última aula. Alguém pode me ajudar?',
    },
    {
      id: '3',
      autor: `Prof. ${professor}`,
      data: '08/12/2024',
      conteudo: 'Material complementar disponível na biblioteca virtual. Não se esqueçam de revisar!',
    },
  ]);

  // Estado para o modal de exclusão
  const [modalVisible, setModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // Função para editar post - navega para a tela update
  const handleEditarPost = (post: Post) => {
    router.push({
      pathname: '/screens/Post/update',
      params: {
        id: post.id,
        // Você pode passar mais parâmetros se precisar
      }
    });
  };

  // Função para excluir post
  const handleExcluirPost = (postId: string) => {
    setPostToDelete(postId);
    setModalVisible(true);
  };

  // Confirmar exclusão
  const confirmarExclusao = () => {
    if (postToDelete) {
      setPosts(posts.filter(post => post.id !== postToDelete));
      setModalVisible(false);
      setPostToDelete(null);
      Alert.alert('Sucesso', 'Post excluído com sucesso!');
    }
  };

  // Cancelar exclusão
  const cancelarExclusao = () => {
    setModalVisible(false);
    setPostToDelete(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com botão de voltar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Detalhes da Aula</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Informações da aula */}
        <View style={styles.aulaCard}>
          <Text style={styles.aulaTitulo}>{titulo}</Text>
          <Text style={styles.professor}>{professor}</Text>
          <Text style={styles.descricao}>{descricao}</Text>
          <Text style={styles.aulaId}>ID: {aulaId}</Text>
        </View>

        {/* Seção de Posts */}
        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Posts da Aula ({posts.length})</Text>
          
          {posts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhum post ainda</Text>
              <Text style={styles.emptyStateSubtext}>Seja o primeiro a postar!</Text>
            </View>
          ) : (
            posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.postInfo}>
                    <Text style={styles.postAutor}>{post.autor}</Text>
                    <Text style={styles.postData}>{post.data}</Text>
                  </View>
                  
                  {/* Botões de ação */}
                  <View style={styles.postActions}>
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => handleEditarPost(post)}
                    >
                      <Text style={styles.editButtonText}>✏️ Editar</Text>
                    </Pressable>
                    
                    <Pressable
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleExcluirPost(post.id)}
                    >
                      <Text style={styles.deleteButtonText}>🗑️ Excluir</Text>
                    </Pressable>
                  </View>
                </View>
                
                <Text style={styles.postConteudo}>{post.conteudo}</Text>
              </View>
            ))
          )}
        </View>

        {/* Botão para criar novo post */}
        <Pressable 
          style={styles.novoPostButton}
          onPress={() => Alert.alert('Novo Post', 'Funcionalidade será implementada')}
        >
          <Text style={styles.novoPostButtonText}>+ Novo Post</Text>
        </Pressable>
      </ScrollView>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelarExclusao}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Text style={styles.modalIconText}>⚠️</Text>
            </View>
            
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
            </Text>
            
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={cancelarExclusao}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmarExclusao}
              >
                <Text style={styles.modalButtonTextConfirm}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#024886',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  aulaCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aulaTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#024886',
    marginBottom: 8,
  },
  professor: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  descricao: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  aulaId: {
    fontSize: 12,
    color: '#999',
  },
  postsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  postCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  postHeader: {
    marginBottom: 12,
  },
  postInfo: {
    marginBottom: 12,
  },
  postAutor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#024886',
    marginBottom: 4,
  },
  postData: {
    fontSize: 12,
    color: '#999',
  },
  postConteudo: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  postActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  editButtonText: {
    fontSize: 13,
    color: '#024886',
    fontWeight: '600',
  },
  deleteButtonText: {
    fontSize: 13,
    color: '#C62828',
    fontWeight: '600',
  },
  novoPostButton: {
    backgroundColor: '#279951',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  novoPostButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#BBB',
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconText: {
    fontSize: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalButtonConfirm: {
    backgroundColor: '#D32F2F',
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});