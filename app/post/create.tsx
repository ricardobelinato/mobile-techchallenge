import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { createPost } from "../../src/api/posts/createPost";

export default function PostCreate() {
    const router = useRouter();

    const [titulo, setTitulo] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [materia, setMateria] = useState("");
    const [imagem, setImagem] = useState("");
    const [criando, setCriando] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        try {
            if (Platform.OS === "web") {
                const authUser = sessionStorage.getItem('@auth_user');
                if (authUser) {
                    const user = JSON.parse(authUser);
                    setUserId(user.id);
                    console.log("User ID carregado:", user.id);
                } else {
                    console.error("Usuário não encontrado no sessionStorage");
                }
            }
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
        }
    }, []);

    const criar = async () => {
        if (!titulo.trim() || !conteudo.trim()) {
            if (Platform.OS === "web") {
                alert("Título e conteúdo são obrigatórios!");
            } else {
                Alert.alert("Atenção", "Título e conteúdo são obrigatórios!");
            }
            return;
        }

        if (!userId) {
            if (Platform.OS === "web") {
                alert("Erro: Usuário não identificado. Faça login novamente.");
            } else {
                Alert.alert("Erro", "Usuário não identificado. Faça login novamente.");
            }
            return;
        }

        try {
            setCriando(true);

            const postData = {
                titulo: titulo.trim(),
                conteudo: conteudo.trim(),
                usuario_id: userId,
                ...(materia.trim() && { materia: materia.trim() }),
                ...(imagem.trim() && { imagem: imagem.trim() }),
            };

            console.log("Dados sendo enviados:", postData);

            const result = await createPost(postData);
            
            console.log("Post criado com sucesso:", result);

            if (Platform.OS === "web") {
                alert("Post criado com sucesso!");
                router.replace("/home");
            } else {
                Alert.alert("Sucesso", "Post criado com sucesso!", [
                    { text: "OK", onPress: () => router.replace("/home") },
                ]);
            }
        } catch (error) {
            console.error("Erro completo ao criar post:", error);
            console.error("Response data:", error?.response?.data);
            console.error("Response status:", error?.response?.status);
            
            if (Platform.OS === "web") {
                alert(`Erro ao criar post: ${error?.response?.data?.erro || error.message}`);
            } else {
                Alert.alert(
                    "Erro",
                    `Não foi possível criar o post: ${error?.response?.data?.erro || error.message}`
                );
            }
        } finally {
            setCriando(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Criar Nova Postagem</Text>
            <View style={{ height: 20 }} />

            <View style={styles.card}>
                {/* DEBUG INFO */}
                {/* {__DEV__ && userId && (
                    <View style={[styles.infoBox, { backgroundColor: "#E8F8E8", borderLeftColor: "#28a745" }]}>
                        <Text style={[styles.infoText, { color: "#28a745" }]}>
                            ✓ Logado como usuário ID: {userId}
                        </Text>
                    </View>
                )} */}

                {/* CAMPOS EDITÁVEIS */}
                <Text style={styles.label}>Título *</Text>
                <TextInput
                    value={titulo}
                    onChangeText={setTitulo}
                    placeholder="Digite o título..."
                    style={styles.input}
                    editable={!criando}
                />

                <Text style={styles.label}>Conteúdo *</Text>
                <TextInput
                    value={conteudo}
                    onChangeText={setConteudo}
                    placeholder="Digite o conteúdo..."
                    multiline
                    numberOfLines={8}
                    style={[styles.input, styles.textArea]}
                    editable={!criando}
                />

                <Text style={styles.label}>Matéria (opcional)</Text>
                <TextInput
                    value={materia}
                    onChangeText={setMateria}
                    placeholder="Ex: Matemática, Português..."
                    style={styles.input}
                    editable={!criando}
                />

                <Text style={styles.label}>URL da Imagem (opcional)</Text>
                <TextInput
                    value={imagem}
                    onChangeText={setImagem}
                    placeholder="https://exemplo.com/imagem.jpg"
                    style={styles.input}
                    editable={!criando}
                    autoCapitalize="none"
                    keyboardType="url"
                />

                {/* INFO */}
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        * Campos obrigatórios
                    </Text>
                </View>

                {/* BOTÕES */}
                <TouchableOpacity
                    style={[styles.button, criando && styles.buttonDisabled]}
                    onPress={criar}
                    disabled={criando}
                >
                    {criando ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Criar Post</Text>
                    )}
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.goBackButton, criando && styles.buttonDisabled]}
                    onPress={() => router.back()}
                    disabled={criando}
                >
                    <Text style={styles.goBackButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f3f5f7",
        minHeight: "100%",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 4,
        color: "#024886",
        textAlign: "center",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 22,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: "#E9E9E9",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#2d2d2d",
    },
    input: {
        backgroundColor: "#F5F6FA",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        color: "#000",
    },
    textArea: {
        height: 140,
        textAlignVertical: "top",
    },
    infoBox: {
        backgroundColor: "#E8F4F8",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 3,
        borderLeftColor: "#024886",
    },
    infoText: {
        fontSize: 13,
        color: "#024886",
        fontStyle: "italic",
    },
    button: {
        backgroundColor: "#024886",
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 50,
    },
    goBackButton: {
        borderWidth: 2,
        borderColor: "#024886",
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 50,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
        color: "#FFF",
    },
    goBackButtonText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
        color: "#024886",
    },
});
