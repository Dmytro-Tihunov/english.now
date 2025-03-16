import { useFonts } from "expo-font";
import { Stack, useRouter, usePathname } from "expo-router"; // Add useRouter
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthProvider";
import { useAuth } from "../context/AuthProvider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function NavigationHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isPending } = useAuth();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Chevy: require("../assets/fonts/Chewy-Regular.ttf"),
  });

  useEffect(() => {
    if (isPending || !loaded) {
      return;
    }

    if (session && pathname === "/") {
      router.replace("/(app)");
    } else if (!session && pathname.startsWith("/(app)")) {
      router.replace("/");
    }

    SplashScreen.hideAsync();
  }, [session, isPending, router, pathname, loaded]);

  if (isPending) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "white" },
      }}
    >
      {!session ? <Stack.Screen name="index" /> : <Stack.Screen name="(app)" />}
      <Stack.Screen
        name="+not-found"
        options={{
          title: "Oops!",
          headerShown: true,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationHandler />
        <StatusBar style="auto" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
