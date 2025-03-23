import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GrammarHtmlRender } from "../../../../components/grammar/GrammarHtmlRender";

// This would be your actual API endpoint
const fetchGrammarDetails = async (slug: string) => {
  const response = await fetch(`http://localhost:8787/v1/grammar/${slug}`);
  if (!response) {
    throw new Error("Failed to fetch grammar details");
  }
  return response.json();
};

export default function GrammarDetails() {
  const { top } = useSafeAreaInsets();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["grammar", slug],
    queryFn: () => fetchGrammarDetails(slug),
  });

  console.log("API Response:", data);

  // For testing, let's use a hardcoded example if no data
  const testContent = `<div>
    <h2>Present Simple Usage</h2>
    <ul>
      <li>Regular actions: <em>I work every day</em></li>
      <li>Facts: <em>The sun rises in the east</em></li>
    </ul>
  </div>`;

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
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
      <View style={styles.content}>
        <Text style={styles.title}>
          {data?.grammar?.title || "Grammar Title"}
        </Text>
        <GrammarHtmlRender
          content={data?.grammar?.htmlContent || testContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
