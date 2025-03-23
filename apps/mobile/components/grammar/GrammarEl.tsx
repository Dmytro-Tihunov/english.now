import { Text, View, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function GrammarEl({
  title,
  description,
  slug,
}: {
  title: string;
  description: string;
  slug: string;
}) {
  const router = useRouter();
  return (
    <View style={styles.element}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Button
        title="Go to grammar"
        onPress={() => router.push(`/(app)/(index)/grammar/${slug}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
  },
  element: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "white",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});
