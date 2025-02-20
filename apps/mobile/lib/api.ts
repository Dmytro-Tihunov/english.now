import axios from "axios";
import Constants from "expo-constants";

const API_URL = Constants?.expoConfig?.extra?.API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

export default api;
