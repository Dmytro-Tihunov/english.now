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
import { GrammarHtmlRender } from "../../../../components/grammar/GrammarHtmlRender";
import { useGrammarData } from "@/hooks/useGrammarData";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
export default function GrammarDetails() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { fetchGrammarDetails } = useGrammarData();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["grammar", slug],
    queryFn: () => fetchGrammarDetails(slug),
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
        <Text style={styles.error}>Error loading grammar details</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <LinearGradient
        colors={["#D6BEF9", "white"]}
        style={styles.fadeBackground}
      />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>{data?.grammar?.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <GrammarHtmlRender content={data?.grammar?.htmlContent || ""} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
