import { View, Text, StyleSheet } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";

export default function AppBottomSheetStreakContent() {
  return (
    <View>
      <Text style={styles.drawerTitle}>Your Streak</Text>

      <View style={styles.streakInfo}>
        <IconSymbol size={40} color="#FF9500" name="flame.fill" />
        <Text style={styles.streakCount}>10</Text>
        <Text style={styles.streakText}>days</Text>
      </View>

      <Text style={styles.streakMessage}>
        Keep learning daily to maintain your streak!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  streakInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  streakCount: {
    fontSize: 24,
    fontWeight: "bold",
  },
  streakText: {
    fontSize: 16,
    color: "#666",
  },
  streakMessage: {
    fontSize: 16,
    color: "#666",
  },
});
