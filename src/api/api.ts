import axios from "axios";
import { Platform } from "react-native";

const LOCAL_IP = '10.0.0.53'

const api = axios.create({
  baseURL: Platform.OS === "web" 
    ? "http://localhost:3000" 
    : `http://${LOCAL_IP}:3000`,
});

api.interceptors.request.use(function (config) {
    console.log(config);
    const token = localStorage.getItem("token"); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }, function (error) {
    return Promise.reject(error);
  });
  
  export default api;