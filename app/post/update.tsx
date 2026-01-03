import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { getPostById } from "../../src/api/posts/getPostById";
import { updatePost } from "../../src/api/posts/updatePost";

export default function PostUpdate() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [titulo, setTitulo] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [materia, setMateria] = useState("");
    const [autor, setAutor] = useState("");
    const [dataCriacao, setDataCriacao] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    const carregarPost = async () => {
        if (!id) {
            Alert.alert("Erro", "ID do post não fornecido!");
            router.back();
            return;
        }

        try {
            setCarregando(true);
            const post = await getPostById(Number(id));
            
            setTitulo(post.titulo || "");
            setConteudo(post.conteudo || "");
            setMateria(post.materia || "Não informada");
            setAutor(post.Usuario?.nome || "Desconhecido");
            
            // Formata a data
            if (post.data_criacao) {
                const data = new Date(post.data_criacao);
                setDataCriacao(data.toLocaleDateString('pt-BR'));
            }
        } catch (error) {
            console.error("Erro ao carregar post:", error);
            Alert.alert(
                "Erro",
                "Não foi possível carregar o post. Tente novamente.",
                [{ text: "OK", onPress: () => router.back() }]
            );
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarPost();
    }, [id]);

    const salvar = async () => {
        if (!titulo.trim() || !conteudo.trim()) {
            Alert.alert("Atenção", "Título e conteúdo são obrigatórios!");
            return;
        }

        try {
            setSalvando(true);

            await updatePost(Number(id), {
                titulo: titulo.trim(),
                conteudo: conteudo.trim()
            });

            router.replace("/home");
            Alert.alert("Sucesso", "Post atualizado com sucesso!", [
                { text: "OK", onPress: () => router.replace("/home") },
            ]);
        } catch (error) {
            console.error("Erro ao salvar post:", error);
            Alert.alert(
                "Erro",
                "Não foi possível salvar as alterações. Tente novamente."
            );
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#024886" />
                <Text style={styles.loadingText}>Carregando post...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar Postagem{"\n"}</Text>
            {/* <Text style={styles.subtitle}>ID: {id}</Text> */}

            <View style={styles.card}>
                {/* CAMPOS EDITÁVEIS */}
                <Text style={styles.label}>Título *</Text>
                <TextInput
                    value={titulo}
                    onChangeText={setTitulo}
                    placeholder="Digite o título..."
                    style={styles.input}
                    editable={!salvando}
                />

                <Text style={styles.label}>Conteúdo *</Text>
                <TextInput
                    value={conteudo}
                    onChangeText={setConteudo}
                    placeholder="Digite o conteúdo..."
                    multiline
                    numberOfLines={8}
                    style={[styles.input, styles.textArea]}
                    editable={!salvando}
                />

                {/* CAMPOS SOMENTE LEITURA */}
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Matéria:</Text>
                    <Text style={styles.infoValue}>{materia}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Autor:</Text>
                    <Text style={styles.infoValue}>{autor}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Data de criação:</Text>
                    <Text style={styles.infoValue}>{dataCriacao}</Text>
                </View>

                {/* BOTÕES */}
                <TouchableOpacity
                    style={[styles.button, salvando && styles.buttonDisabled]}
                    onPress={salvar}
                    disabled={salvando}
                >
                    {salvando ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Salvar Alterações</Text>
                    )}
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.goBackButton, salvando && styles.buttonDisabled]}
                    onPress={() => router.back()}
                    disabled={salvando}
                >
                    <Text style={styles.goBackButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f5f7",
    },
    loadingText: {
        fontSize: 16,
        color: "#555",
        marginTop: 12,
    },
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
    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
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
    infoContainer: {
        flexDirection: "row",
        marginBottom: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#F8F9FA",
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: "#024886",
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#555",
        marginRight: 8,
    },
    infoValue: {
        fontSize: 14,
        color: "#333",
        flex: 1,
    },
    button: {
        backgroundColor: "#024886",
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 20,
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
