import { Stack } from "expo-router";
import { View } from "react-native";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(index)" />
    </Stack>
  );
}
