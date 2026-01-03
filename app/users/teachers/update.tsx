import { useLocalSearchParams, useRouter } from "expo-router";
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
import { getUserById } from "../../../src/api/users/getUserById";
import { updateUser } from "../../../src/api/users/updateUser";

export default function ProfessorUpdate() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [dataCriacao, setDataCriacao] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    const carregarProfessor = async () => {
        if (!id) {
            Alert.alert("Erro", "ID do professor não fornecido!");
            router.back();
            return;
        }

        try {
            setCarregando(true);
            const user = await getUserById(Number(id));
            
            // Verifica se é realmente um professor
            if (!user.admin) {
                if (Platform.OS === "web") {
                    alert("Este usuário é um aluno, não um professor!");
                } else {
                    Alert.alert("Erro", "Este usuário é um aluno, não um professor!");
                }
                router.back();
                return;
            }

            setNome(user.nome || "");
            setEmail(user.email || "");
            
            if (user.data_criacao) {
                const data = new Date(user.data_criacao);
                setDataCriacao(data.toLocaleDateString('pt-BR'));
            }
        } catch (error) {
            console.error("Erro ao carregar professor:", error);
            Alert.alert(
                "Erro",
                "Não foi possível carregar o professor. Tente novamente.",
                [{ text: "OK", onPress: () => router.back() }]
            );
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarProfessor();
    }, [id]);

    const salvar = async () => {
        if (!nome.trim() || !email.trim()) {
            if (Platform.OS === "web") {
                alert("Nome e email são obrigatórios!");
            } else {
                Alert.alert("Atenção", "Nome e email são obrigatórios!");
            }
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            if (Platform.OS === "web") {
                alert("Por favor, insira um e-mail válido!");
            } else {
                Alert.alert("Atenção", "Por favor, insira um e-mail válido!");
            }
            return;
        }

        if (senha.trim() && senha.trim().length < 6) {
            if (Platform.OS === "web") {
                alert("A senha deve ter no mínimo 6 caracteres!");
            } else {
                Alert.alert("Atenção", "A senha deve ter no mínimo 6 caracteres!");
            }
            return;
        }

        try {
            setSalvando(true);

            const userData: any = {
                nome: nome.trim(),
                email: email.trim(),
                admin: true,
            };

            if (senha.trim()) {
                userData.senha = senha.trim();
            }

            await updateUser(Number(id), userData);

            if (Platform.OS === "web") {
                alert("Professor atualizado com sucesso!");
                router.replace("/users/teachers/read");
            } else {
                Alert.alert("Sucesso", "Professor atualizado com sucesso!", [
                    { text: "OK", onPress: () => router.replace("/users/teachers/read") },
                ]);
            }
        } catch (error) {
            console.error("Erro ao salvar professor:", error);
            
            const errorMsg = error?.response?.data?.erro || 
                           error?.response?.data?.message ||
                           "Não foi possível salvar as alterações. Tente novamente.";
            
            if (Platform.OS === "web") {
                alert(errorMsg);
            } else {
                Alert.alert("Erro", errorMsg);
            }
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#024886" />
                <Text style={styles.loadingText}>Carregando professor...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar Professor</Text>
            <View style={{ height: 20 }} />

            <View style={styles.card}>
                <Text style={styles.label}>Nome Completo *</Text>
                <TextInput
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Digite o nome completo..."
                    style={styles.input}
                    editable={!salvando}
                />

                <Text style={styles.label}>E-mail *</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Digite o e-mail..."
                    style={styles.input}
                    editable={!salvando}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Nova Senha (opcional)</Text>
                <TextInput
                    value={senha}
                    onChangeText={setSenha}
                    placeholder="Deixe em branco para não alterar"
                    style={styles.input}
                    editable={!salvando}
                    secureTextEntry
                    autoCapitalize="none"
                />

                {/* CAMPO SOMENTE LEITURA */}
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Data de Cadastro:</Text>
                    <Text style={styles.infoValue}>{dataCriacao}</Text>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        * Campos obrigatórios{'\n'}
                        • A senha só será alterada se você preencher o campo{'\n'}
                        • O professor manterá o acesso padrão ao sistema
                    </Text>
                </View>

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
        lineHeight: 20,
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
