import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Page() {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [materia, setMateria] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);

  const escolherImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const enviarPost = () => {
    if (!titulo.trim()) {
      Alert.alert("Erro", "O título é obrigatório.");
      return;
    }

    const novoPost = { titulo, conteudo, materia, imagem };
    console.log("POST CRIADO (simulado):", novoPost);

    Alert.alert("Sucesso", "Post criado com sucesso!");

    setTitulo("");
    setConteudo("");
    setMateria("");
    setImagem(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.headerTitle}>Criar Post</Text>

      {/* TÍTULO */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o título"
          placeholderTextColor="#999"
          value={titulo}
          onChangeText={setTitulo}
        />
      </View>

      {/* MATÉRIA */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Matéria</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Programação, Matemática…"
          placeholderTextColor="#999"
          value={materia}
          onChangeText={setMateria}
        />
      </View>

      {/* CONTEÚDO */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Conteúdo</Text>
        <TextInput
          style={[styles.input, styles.areaTexto]}
          placeholder="Digite o conteúdo da postagem"
          placeholderTextColor="#999"
          value={conteudo}
          onChangeText={setConteudo}
          multiline
        />
      </View>

      {/* IMAGEM */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Imagem</Text>

        <Pressable style={styles.btnUpload} onPress={escolherImagem}>
          <Text style={styles.btnUploadTexto}>
            {imagem ? "Alterar imagem" : "Selecionar imagem"}
          </Text>
        </Pressable>

        {imagem && (
          <Image source={{ uri: imagem }} style={styles.previewImagem} />
        )}
      </View>

      {/* BOTÃO SALVAR */}
      <Pressable style={styles.btnSalvar} onPress={enviarPost}>
        <Text style={styles.btnSalvarTexto}>Criar Post</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FA",
    padding: 20,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#024886",
    marginBottom: 25,
    textAlign: "center",
  },

  formGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    color: "#2E2E2E",
  },

  input: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D9DDE1",
    fontSize: 15,
    color: "#333",
  },

  areaTexto: {
    height: 130,
    textAlignVertical: "top",
  },

  btnUpload: {
    backgroundColor: "#E6EEF8",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1.3,
    borderColor: "#B9CEE6",
  },

  btnUploadTexto: {
    color: "#024886",
    fontSize: 15,
    fontWeight: "700",
  },

  previewImagem: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: "#CBD6E2",
  },

  btnSalvar: {
    backgroundColor: "#024886",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 10,
  },

  btnSalvarTexto: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
  },
});
