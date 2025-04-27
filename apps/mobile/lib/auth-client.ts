import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/auth/`,
  plugins: [
    expoClient({
      scheme: "myapp",
      storagePrefix: "myapp",
      storage: SecureStore,
    }),
    inferAdditionalFields({
      user: {
        language: {
          type: "string",
        },
        theme: {
          type: "string",
        },
        currentCourseId: {
          type: "number",
        },
        isOnboarded: {
          type: "boolean",
        },
        currentStreak: {
          type: "number",
        },
        longestStreak: {
          type: "number",
        },
      },
    }),
  ],
  disableCache: true,
});

export type Session = typeof authClient.$Infer.Session;
