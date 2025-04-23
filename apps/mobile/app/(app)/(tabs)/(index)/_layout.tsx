import { Stack } from "expo-router";

export default function TabsIndexLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "none" }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
