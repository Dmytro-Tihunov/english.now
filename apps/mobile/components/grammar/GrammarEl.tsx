import { Text, View, StyleSheet, Pressable, Animated } from "react-native";
import { useRouter } from "expo-router";
import { courseColors } from "@/constants/Colors";
import { useRef } from "react";

export default function GrammarEl({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={[styles.element]}
        onPress={() => router.push(`/(app)/(index)/grammar/${slug}`)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.course}>Майбутній тривалий час</Text>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>A1</Text>
        </View>
      </Pressable>
    </Animated.View>
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  course: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  buttonText: {
    backgroundColor: courseColors.A1.background,
    borderWidth: 1,
    borderColor: "#111111",
    padding: 4,
    paddingHorizontal: 16,
    borderRadius: 16,
    fontSize: 14,
    color: "#111111",
  },
  button: {
    backgroundColor: courseColors.A1.background,
    padding: 4,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
});
