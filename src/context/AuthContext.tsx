// import { clearAuth, getAuth, saveAuth } from "@/src/storage/authStorage";
// import { router } from "expo-router";
// import { createContext, useContext, useEffect, useState } from "react";

// type User = {
//   id: number;
//   nome: string;
//   email: string;
//   admin: boolean;
// };

// type AuthData = {
//   token: string;
//   user: User;
// };

// type AuthContextType = {
//   auth: AuthData | null;
//   loading: boolean;
//   login: (data: AuthData) => Promise<void>;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// export function AuthProvider({ children }) {
//     const [auth, setAuth] = useState<AuthData | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         (async () => {
//         const data = await getAuth();
//         setAuth(data);
//         setLoading(false);
//         })();
//     }, []);

//     const logout: () => Promise<void> = async () => {
//       clearAuth();
//       setAuth(null);
//       router.replace('/');
//     };

//     const login = async (data: AuthData) => {
//       await saveAuth(data);
//       setAuth(data);
//     };

//   return (
//     <AuthContext.Provider value={{ auth, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

import { clearAuth, getAuth, saveAuth } from "@/src/storage/authStorage";
import { router } from "expo-router";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

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
  logout: () => Promise<void>;
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

  const logout = useCallback(async () => {
    await clearAuth();
    setAuth(null);
    router.replace('/');
  }, []);

  const login = useCallback(async (data: any) => {
    await saveAuth(data);

    if (data.user) {
    setAuth(data);
  } else {
    const formattedAuth = {
      token: data.token,
      user: {
        id: data.id,
        nome: data.nome,
        email: data.email,
        admin: data.admin
      }
    };
    setAuth(formattedAuth);
  }
  }, []);

  const value = useMemo(
    () => ({ auth, loading, login, logout }),
    [auth, loading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
