import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLessonData } from "@/hooks/useLessonData";
import { Ionicons } from "@expo/vector-icons";

export default function LessonDetails() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { fetchLesson } = useLessonData();

  const { data, isLoading, error } = useQuery({
    queryKey: ["lesson", slug],
    queryFn: () => fetchLesson(slug),
  });

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: top, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator color="#111111" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <Text style={styles.error}>Error loading lesson</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#000" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.headerTitle}>{slug}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
  content: {
    padding: 16,
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  fadeBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  backButton: {
    padding: 8,
  },
});
