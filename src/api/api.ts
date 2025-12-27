import axios from "axios";
import { Platform } from "react-native";
import { config } from "../config/env";

const api = axios.create({
  baseURL: config.apiUrl || (Platform.OS === "web" 
    ? "http://localhost:3000" 
    : "http://10.0.2.2:3000"),
});

export default api;
