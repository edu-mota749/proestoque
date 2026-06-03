import { api, setUnauthorizedHandler } from "@/src/services/api";
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
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
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

  const limparSessaoLocal = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

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

  useEffect(() => {
    setUnauthorizedHandler(limparSessaoLocal);

    return () => setUnauthorizedHandler(null);
  }, [limparSessaoLocal]);

  const salvarSessao = useCallback(async (tokenNovo: string, usuarioNovo: User) => {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.TOKEN, tokenNovo],
      [STORAGE_KEYS.USER, JSON.stringify(usuarioNovo)],
    ]);

    setToken(tokenNovo);
    setUser(usuarioNovo);
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, senha });
      const { usuario, token } = response.data as { usuario: User; token: string };

      await salvarSessao(token, usuario);
    } catch (error) {
      throw error instanceof Error ? error : new Error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  }, [salvarSessao]);

  const registrar = useCallback(async (nome: string, email: string, senha: string) => {
    setIsLoading(true);

    try {
      const response = await api.post("/auth/registro", { nome, email, senha });
      const { usuario, token } = response.data as { usuario: User; token: string };

      await salvarSessao(token, usuario);
    } catch (error) {
      throw error instanceof Error ? error : new Error("Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  }, [salvarSessao]);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
    } catch (error) {
      console.error("Erro ao remover dados de armazenamento:", error);
    } finally {
      limparSessaoLocal();
    }
  }, [limparSessaoLocal]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        registrar,
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