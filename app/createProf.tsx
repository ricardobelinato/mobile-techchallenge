import { useRouter } from "expo-router";

import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CreateTeacher() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.title}>Criar Perfil Administrativo</Text>

            {/* Nome */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Nome *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o Nome Completo do Professor"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            {/* Email */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Insira um Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            {/* Senha */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Senha *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Crie uma Senha"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Criar Usuário</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.goBackButton} onPress={() => router.navigate("/home")}>
                <Text style={styles.goBackButtonText}>Voltar</Text>
            </TouchableOpacity >
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F6FA",
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
        color: "#333",
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
        width: "100%",
        height: 50,
        backgroundColor: "#f1f1f1",
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    button: {
        backgroundColor: "#4A90E2",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
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
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    goBackButtonText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
        color: "#1E88E5",
    },
});
