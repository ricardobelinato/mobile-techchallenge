import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function CustomDrawer({ visible, onClose }: Props) {
  const slideAnim = useRef(new Animated.Value(-280)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : -280,
      useNativeDriver: false,
      bounciness: 6,
      speed: 10,
    }).start();
  }, [visible]);

  const go = (path: Href) => {
    router.push(path);
    onClose();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('@auth_token');
    sessionStorage.removeItem('@auth_user');
    go("/");
  };

  return (
    <>
      {visible && (
        <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1} />
      )}

      <Animated.View style={[styles.drawer, { left: slideAnim }]}>
        {/* Avatar e nome */}
        <View style={styles.header}>
          <Image
            source={require("../assets/images/favicon.png")}
            style={styles.avatar}
          />
          <Text style={styles.name}>Olá, Professor</Text>
          <Text style={styles.role}>Conta Educacional</Text>
        </View>

        <View style={styles.separator} />

        {/* Ações */}
        <TouchableOpacity style={styles.item} onPress={() => go("/home")}>
          <Ionicons name="home-outline" size={23} color="#333" />
          <Text style={styles.itemText}>Página Inicial</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => go("/post/create")}>
          <Ionicons name="create-outline" size={23} color="#333" />
          <Text style={styles.itemText}>Criar Postagem</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={23} color="#D62839" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 1,
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 2,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  // Cabeçalho
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#EFEFEF",
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  role: {
    fontSize: 14,
    color: "#666",
  },

  separator: {
    height: 1,
    backgroundColor: "#EDEDED",
    marginVertical: 18,
  },

  // Itens
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  itemText: {
    marginLeft: 14,
    fontSize: 17,
    color: "#333",
  },

  // Logout
  logout: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 8,
  },
  logoutText: {
    marginLeft: 14,
    fontSize: 17,
    color: "#D62839",
    fontWeight: "600",
  },
});
