import { clearAuth, getAuth, saveAuth } from "@/src/storage/authStorage";
import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

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
  me: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // useEffect(() => {
  //    me()
  // }, [router]);
  useEffect(() => {
     me()
  }, []);


  const me = async () => {
    try {
        const data = await getAuth();
        if (data?.success && data.user) {
          setAuth({
            user: {
              id: data.user.id,
              nome: data.user.nome,
              email: data.user.email,
              admin: data.user.admin,
            },
            token: data.user.token,
          });
        }else {
          setAuth(null);
          router.push('/');
        }
      } catch (error) {
        console.error("Erro ao carregar dados de autenticação:", error);
      } finally {
        setLoading(false);
      }
  }


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
    <AuthContext.Provider value={{ auth, loading, login, logout, me }}>
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