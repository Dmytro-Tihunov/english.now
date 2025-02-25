import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function CourseScreen() {
  const { id, title } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen
        options={{
          title: (title as string) || `Course ${id}`,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </Pressable>
          ),
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{title || `Course ${id}`}</Text>
          <Text style={styles.subtitle}>Welcome to this course!</Text>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
  backButton: {
    padding: 8,
  },
});
