import axios from "axios";
import { Platform } from "react-native";

const LOCAL_IP = '10.0.0.53'

const api = axios.create({
  baseURL: Platform.OS === "web" 
    ? "http://localhost:3000" 
    : `http://${LOCAL_IP}:3000`,
});

export default api;
