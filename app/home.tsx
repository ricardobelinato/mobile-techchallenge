import React from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

// Criei apenas para mostrar algumas aulas, depois alteramos para consumir da api
const aulas = [
  { id: '1', titulo: 'Introdução à Programação', professor: 'Prof. fulano', descrição: 'Descrição da aula de Introdução à programação'},
  { id: '2', titulo: 'Front-end', professor: 'Prof. fulana', descrição: 'Descrição da aula de Front-end'},
  { id: '3', titulo: 'Estruturas de Dados', professor: 'Prof. fulano', descrição: 'Descrição da aula de Estruturas de Dados'},
  { id: '4', titulo: 'Banco de Dados', professor: 'Prof. fulana', descrição: 'Descrição da aula de Banco de Dados'},
  { id: '5', titulo: 'Back-end', professor: 'Prof. fulano', descrição: 'Descrição da aula de Back-end'},
];

export default function HomeScreen() {
  const renderizaAula = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.aulaTitulo}>{item.titulo}</Text>
        <Text style={styles.descricao}>{item.descrição}</Text>
        <Text style={styles.aulaInfo}>{item.professor}</Text>
      </View>
      <View>
        <Pressable
          style={styles.botao}
          onPress={() => console.log(`Acessando aula: ${item.titulo}`)}
        >
          <Text style={styles.textoBotao}>Ver aula</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={{ color: '#024886' }}>School</Text>
          <Text style={{ color: '#279951' }}>On</Text>
        </Text>
        <Text style={styles.subtitle}>Aulas Disponíveis</Text>
      </View>

      <FlatList
        data={aulas}
        renderItem={renderizaAula}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginTop: 5,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aulaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  descricao: {
    color: '#3b3b3bff',
    paddingBottom: 15
  },
  aulaInfo: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  botao: {
    backgroundColor: '#024886',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,  
  },
  textoBotao: {
    color: '#fff'
  }
});
