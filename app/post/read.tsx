import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { getPostById } from "../../src/api/posts/getPostById";
import { getAuth } from "../../src/storage/authStorage";

export default function PostRead() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [auth, setAuth] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [materia, setMateria] = useState("");
    const [autor, setAutor] = useState("");
    const [imagem, setImagem] = useState("");
    const [dataCriacao, setDataCriacao] = useState("");
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        let mounted = true;

        (async () => {
            const data = await getAuth();
            if (mounted) setAuth(data);
        })();

        return () => { mounted = false };
    }, []);

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
            setMateria(post.materia || "");
            setAutor(post.Usuario?.nome || "Desconhecido");
            setImagem(post.imagem || "");
            
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

    const getPostImage = () => {
        if (imagem) return imagem;
        return `https://picsum.photos/seed/post-${id ?? Math.random()}/600/400`;
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
            <View style={styles.card}>
                {/* IMAGEM */}
                <Image
                    source={{ uri: getPostImage() }}
                    style={styles.postImage}
                />

                {/* TÍTULO */}
                <Text style={styles.titulo}>{titulo}</Text>

                {/* MATÉRIA */}
                {materia && (
                    <View style={styles.materiaContainer}>
                        <Text style={styles.materia}>{materia}</Text>
                    </View>
                )}

                {/* INFO AUTOR E DATA */}
                <View style={styles.infoRow}>
                    <Text style={styles.autorTexto}>Por: {autor}</Text>
                    {dataCriacao && (
                        <Text style={styles.dataTexto}>{dataCriacao}</Text>
                    )}
                </View>

                {/* DIVISOR */}
                <View style={styles.divisor} />

                {/* CONTEÚDO */}
                <Text style={styles.conteudo}>{conteudo}</Text>

                {/* BOTÃO EDITAR (só aparece para admin) */}
                {auth?.user?.admin && (
                    <TouchableOpacity
                        style={styles.botaoEditar}
                        onPress={() => router.push({
                            pathname: "/post/update",
                            params: { id }
                        })}
                    >
                        <Text style={styles.botaoEditarTexto}>Editar post</Text>
                    </TouchableOpacity>
                )}

                {/* BOTÃO VOLTAR */}
                <TouchableOpacity
                    style={styles.botaoVoltar}
                    onPress={() => router.back()}
                >
                    <Text style={styles.botaoVoltarTexto}>Voltar</Text>
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
    postImage: {
        width: "100%",
        height: 250,
        borderRadius: 14,
        marginBottom: 20,
    },
    titulo: {
        fontSize: 26,
        fontWeight: "700",
        color: "#024886",
        marginBottom: 12,
        lineHeight: 32,
    },
    materiaContainer: {
        alignSelf: "flex-start",
        marginBottom: 12,
    },
    materia: {
        backgroundColor: "#02488622",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 8,
        fontSize: 13,
        color: "#024886",
        fontWeight: "600",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 8,
    },
    autorTexto: {
        fontSize: 14,
        color: "#666",
        fontStyle: "italic",
    },
    dataTexto: {
        fontSize: 13,
        color: "#888",
    },
    divisor: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginBottom: 20,
    },
    conteudo: {
        fontSize: 16,
        color: "#333",
        lineHeight: 26,
        marginBottom: 24,
        textAlign: "justify",
    },
    botaoEditar: {
        backgroundColor: "#F39C12",
        paddingVertical: 14,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "center",
    },
    botaoEditarTexto: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
    botaoVoltar: {
        borderWidth: 2,
        borderColor: "#024886",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    botaoVoltarTexto: {
        color: "#024886",
        fontSize: 16,
        fontWeight: "600",
    },
});
