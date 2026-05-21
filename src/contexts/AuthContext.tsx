import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  nome: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
};

const STORAGE_KEYS = {
  TOKEN: "@proestoque:token",
  USER: "@proestoque:user",
} as const;

const SESSION_MIN_LOADING_MS = 1300;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      try {
        const [dadosStorage] = await Promise.all([
          AsyncStorage.multiGet([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]),
          new Promise((resolve) => setTimeout(resolve, SESSION_MIN_LOADING_MS)),
        ]);

        const [tokenSalvo, userSalvo] = dadosStorage;

        const tokenRecuperado = tokenSalvo[1];
        const userRecuperado = userSalvo[1] ? (JSON.parse(userSalvo[1]) as User) : null;

        if (tokenRecuperado && userRecuperado) {
          setToken(tokenRecuperado);
          setUser(userRecuperado);
        }
      } catch (error) {
        console.warn("Erro ao carregar sessao do usuario:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarSessao();
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!email.trim() || !senha.trim()) {
        throw new Error("Preencha e-mail e senha.");
      }

      const tokenSimulado = `token_simulado_${Date.now()}`;
      const userSimulado: User = {
        id: "user_1",
        nome: email.split("@")[0] || "Usuario",
        email,
      };

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, tokenSimulado],
        [STORAGE_KEYS.USER, JSON.stringify(userSimulado)],
      ]);

      setToken(tokenSimulado);
      setUser(userSimulado);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
    } catch (error) {
      console.error("Erro ao remover dados de armazenamento:", error);
    } finally {
      setToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }

  return context;
}