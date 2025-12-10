import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PostsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { aulaId, titulo, professor, descricao } = params;

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
          <Text style={styles.sectionTitle}>Posts da Aula</Text>
          
          {/* Exemplo de posts - depois você pode substituir por dados da API */}
          <View style={styles.postCard}>
            <Text style={styles.postAutor}>Prof. {professor}</Text>
            <Text style={styles.postData}>10/12/2024</Text>
            <Text style={styles.postConteudo}>
              Bem-vindos à aula de {titulo}! Aqui vocês encontrarão todo o material necessário para acompanhar o curso.
            </Text>
          </View>

          <View style={styles.postCard}>
            <Text style={styles.postAutor}>Aluno - João Silva</Text>
            <Text style={styles.postData}>09/12/2024</Text>
            <Text style={styles.postConteudo}>
              Estou com uma dúvida sobre o conteúdo da última aula. Alguém pode me ajudar?
            </Text>
          </View>

          <View style={styles.postCard}>
            <Text style={styles.postAutor}>Prof. {professor}</Text>
            <Text style={styles.postData}>08/12/2024</Text>
            <Text style={styles.postConteudo}>
              Material complementar disponível na biblioteca virtual. Não se esqueçam de revisar!
            </Text>
          </View>
        </View>

        {/* Botão para criar novo post */}
        <Pressable style={styles.novoPostButton}>
          <Text style={styles.novoPostButtonText}>+ Novo Post</Text>
        </Pressable>
      </ScrollView>
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
  postAutor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#024886',
    marginBottom: 4,
  },
  postData: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  postConteudo: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
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
});