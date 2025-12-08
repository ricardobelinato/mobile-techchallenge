import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Profile() {
    const router = useRouter();

    const [carregando, setCarregando] = useState(true);
    const [usuario, setUsuario] = useState({
        nome: "",
        email: "",
        bio: "",
        foto: "",
    });

    // Mock — depois você conecta na API real
    const carregarPerfil = async () => {
        setCarregando(true);

        await new Promise((r) => setTimeout(r, 500));

        setUsuario({
            nome: "Professor João Silva",
            email: "joao.silva@escola.gov.br",
            bio: "Professor de Matemática apaixonado por educação e tecnologia.",
            foto: "https://i.pravatar.cc/300?img=12",
        });

        setCarregando(false);
    };

    useEffect(() => {
        carregarPerfil();
    }, []);

    if (carregando) {
        return (
            <View style={styles.loading}>
                <Text style={{ fontSize: 18, color: "#555" }}>Carregando perfil...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            
            {/* Avatar */}
            <Image source={{ uri: usuario.foto }} style={styles.avatar} />

            {/* Nome */}
            <Text style={styles.nome}>{usuario.nome}</Text>

            {/* Email */}
            <Text style={styles.email}>{usuario.email}</Text>

            {/* Bio */}
            <Text style={styles.bio}>{usuario.bio}</Text>

            {/* Botão Sair */}
            <TouchableOpacity
                style={styles.buttonLogout}
                onPress={() => router.replace("/")}
            >
                <Text style={styles.buttonLogoutText}>Sair</Text>
            </TouchableOpacity>

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
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    avatar: {
        width: 140,
        height: 140,
        borderRadius: 999,
        marginBottom: 20,
    },

    nome: {
        fontSize: 26,
        fontWeight: "700",
        color: "#000",
        marginBottom: 6,
        textAlign: "center",
    },

    email: {
        fontSize: 16,
        color: "#555",
        marginBottom: 18,
        textAlign: "center",
    },

    bio: {
        fontSize: 16,
        color: "#333",
        marginBottom: 40,
        lineHeight: 22,
        textAlign: "center",
        paddingHorizontal: 10,
    },

    buttonLogout: {
        backgroundColor: "#4f88f3ff",
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 12,
        width: "85%",
    },

    buttonLogoutText: {
        color: "#FFF",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
    },
});
