import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  disableCache: true,
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/auth`,
  plugins: [
    expoClient({
      scheme: "myapp",
      storagePrefix: "myapp",
      storage: SecureStore,
    }),
  ],
});

export type Session = typeof authClient.$Infer.Session;
