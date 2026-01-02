import { getAuth } from "@/src/storage/authStorage";
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
  login: (data: AuthData) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState<AuthData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
        const data = await getAuth();
        setAuth(data);
        setLoading(false);
        })();
    }, []);

    const logout = () => {
        sessionStorage.removeItem("@auth_token");
        sessionStorage.removeItem("@auth_user");
        setAuth(null);
    };

    const login = async (data: AuthData) => {
        await Promise.all([
            SecureStore.setItemAsync("token", data.token),
            SecureStore.setItemAsync("user", JSON.stringify(data.user)),
        ]);

        setAuth(data);
    };

  return (
    <AuthContext.Provider value={{ auth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
