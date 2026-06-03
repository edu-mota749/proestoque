import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

type UnauthorizedHandler = (() => void | Promise<void>) | null;

let unauthorizedHandler: UnauthorizedHandler = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler;
}

const API_BASE_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  (Platform.OS === "android" ? "http://192.168.1.2:3333/api" : "http://192.168.1.2:3333/api");

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@proestoque:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(["@proestoque:token", "@proestoque:user"]);

      if (unauthorizedHandler) {
        await unauthorizedHandler();
      }
    }

    const mensagem =
      error.response?.data?.erro ??
      (error.code === "ECONNABORTED"
        ? "Tempo de conexão esgotado"
        : error.message || "Erro de conexão");

    return Promise.reject(new Error(mensagem));
  }
);
