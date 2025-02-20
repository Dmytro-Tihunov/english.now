import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const API_URL = Constants?.expoConfig?.extra?.API_URL;
 
export const authClient = createAuthClient({
    disableCache: true,
    baseURL: `https://server.tihunov.workers.dev/api/auth`,
    plugins: [
        expoClient({
            scheme: "myapp",
            storagePrefix: "myapp",
            storage: SecureStore,
        })
    ]
});