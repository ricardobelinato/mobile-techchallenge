import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function PostUpdate() {
    const { id } = useLocalSearchParams(); // pode vir undefined
    const router = useRouter();

    const [titulo, setTitulo] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [autor, setAutor] = useState("");
    const [carregando, setCarregando] = useState(true);

    // Mock — simula carregar da API
    const carregarPost = async () => {
        setCarregando(true);

        await new Promise((r) => setTimeout(r, 600));

        // Mock: se não tiver ID, usa um post aleatório
        const fakeId = id ?? "123";
        
        setTitulo(`Título de demonstração ${fakeId}`);
        setConteudo("Este é um conteúdo fictício carregado apenas para teste.");
        setAutor("Professor João Silva");

        setCarregando(false);
    };

    useEffect(() => {
        carregarPost();
    }, [id]);

    const salvar = () => {
        if (!titulo.trim() || !conteudo.trim() || !autor.trim()) {
            Alert.alert("Atenção", "Preencha todos os campos!");
            return;
        }

        Alert.alert("Sucesso", "Post atualizado com sucesso!", [
            { text: "OK", onPress: () => router.back() },
        ]);
    };

    if (carregando) {
        return (
            <View style={styles.loading}>
                <Text style={{ fontSize: 18, color: "#555" }}>
                    Carregando post...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar Postagem</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Título</Text>
                <TextInput
                    value={titulo}
                    onChangeText={setTitulo}
                    placeholder="Digite o título..."
                    style={styles.input}
                />

                <Text style={styles.label}>Autor</Text>
                <TextInput
                    value={autor}
                    onChangeText={setAutor}
                    placeholder="Nome do professor..."
                    style={styles.input}
                />

                <Text style={styles.label}>Conteúdo</Text>
                <TextInput
                    value={conteudo}
                    onChangeText={setConteudo}
                    placeholder="Digite o conteúdo..."
                    multiline
                    numberOfLines={6}
                    style={[styles.input, styles.textArea]}
                />

                <TouchableOpacity style={styles.button} onPress={salvar}>
                    <Text style={styles.buttonText}>Salvar Alterações</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
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
        backgroundColor: "#FFF",
    },
    container: {
        padding: 20,
        backgroundColor: "#FFFFFF",
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 25,
        color: "#1a1a1a",
        textAlign: "center",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 22,
        elevation: 6,
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
        marginBottom: 6,
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
    button: {
        backgroundColor: "#1E88E5",
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 10,
    },
    goBackButton: {
        borderWidth: 2,
        borderColor: "#1E88E5",
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 10,
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
        fontWeight: "700",
        color: "#1E88E5",
    },
});