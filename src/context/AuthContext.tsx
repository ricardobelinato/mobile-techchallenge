import { clearAuth, getAuth, saveAuth } from "@/src/storage/authStorage";
import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import SecureStore from 'expo-secure-store'

type User = {
  id: number;
  nome: string;
  email: string;
  admin: boolean;
};

type AuthData = {
  token: string;
  user: User;
};

type AuthContextType = {
  auth: AuthData | null;
  loading: boolean;
  login: (apiResponse: any) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const data = await getAuth();
        setAuth(data);
      } catch (error) {
        console.error("Erro ao carregar dados de autenticação:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (apiResponse: any) => {
    const formattedData: AuthData = {
      token: apiResponse.token,
      user: {
        id: apiResponse.id,
        nome: apiResponse.nome,
        email: apiResponse.email,
        admin: apiResponse.admin,
      },
    };

    await saveAuth(formattedData);

    setAuth(formattedData);
  };

  /**
   * Função de Logout
   */
  const logout = async () => {
    await clearAuth();
    setAuth(null);
    router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ auth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};