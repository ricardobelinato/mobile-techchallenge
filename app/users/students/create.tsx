import { useRouter } from "expo-router";
import { useState } from "react";
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
import { createUser } from "../../../src/api/users/createUser";

export default function AlunoCreate() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [criando, setCriando] = useState(false);

    const criar = async () => {
        if (!nome.trim() || !email.trim() || !senha.trim()) {
            if (Platform.OS === "web") {
                alert("Todos os campos são obrigatórios!");
            } else {
                Alert.alert("Atenção", "Todos os campos são obrigatórios!");
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

        if (senha.trim().length < 6) {
            if (Platform.OS === "web") {
                alert("A senha deve ter no mínimo 6 caracteres!");
            } else {
                Alert.alert("Atenção", "A senha deve ter no mínimo 6 caracteres!");
            }
            return;
        }

        try {
            setCriando(true);

            const userData = {
                nome: nome.trim(),
                email: email.trim(),
                senha: senha.trim(),
                admin: false,
            };

            await createUser(userData);

            if (Platform.OS === "web") {
                alert("Aluno cadastrado com sucesso!");
                router.replace("/users/students/read");
            } else {
                Alert.alert("Sucesso", "Aluno cadastrado com sucesso!", [
                    { text: "OK", onPress: () => router.replace("/users/students/read") },
                ]);
            }
        } catch (error) {
            console.error("Erro ao criar aluno:", error);
            
            const errorMsg = error?.response?.data?.erro || 
                           error?.response?.data?.message ||
                           "Não foi possível cadastrar o aluno. Tente novamente.";
            
            if (Platform.OS === "web") {
                alert(errorMsg);
            } else {
                Alert.alert("Erro", errorMsg);
            }
        } finally {
            setCriando(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Cadastrar Novo Aluno</Text>
            <View style={{ height: 20 }} />

            <View style={styles.card}>
                <Text style={styles.label}>Nome Completo *</Text>
                <TextInput
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Digite o nome completo do aluno"
                    style={styles.input}
                    editable={!criando}
                />

                <Text style={styles.label}>E-mail *</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Digite o e-mail do aluno"
                    style={styles.input}
                    editable={!criando}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Senha *</Text>
                <TextInput
                    value={senha}
                    onChangeText={setSenha}
                    placeholder=""
                    style={styles.input}
                    editable={!criando}
                    secureTextEntry
                    autoCapitalize="none"
                />

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        * Todos os campos são obrigatórios{'\n'}
                        • O aluno terá acesso padrão ao sistema{'\n'}
                        • A senha pode ser alterada posteriormente
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.button, criando && styles.buttonDisabled]}
                    onPress={criar}
                    disabled={criando}
                >
                    {criando ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Cadastrar Aluno</Text>
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
