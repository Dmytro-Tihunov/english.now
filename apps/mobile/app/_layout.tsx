import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router"; // Add useRouter
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthProvider";
import { useAuth } from "../context/AuthProvider";
import "./global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { session, isPending } = useAuth();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Chevy: require("../assets/fonts/Chewy-Regular.ttf"),
  });

  useEffect(() => {
    if (isPending && !loaded) {
      return;
    }

    if (session && !isPending) {
      console.log("session", session);
      router.replace("/(app)");
    } else if (!session && !isPending) {
      console.log("no session");
      router.replace("/(auth)");
    }

    SplashScreen.hideAsync();
  }, [session, isPending, router, loaded]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
