import { View, Text, StyleSheet } from "react-native";
import Heroes1 from "../icons/heroes/Heroes1";
import { useAuth } from "@/context/AuthProvider";

export default function AppHeaderLogo() {
  const { session } = useAuth();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      <View style={{ width: 50, height: 50 }}>
        <Heroes1 />
      </View>
      <Text style={styles.title}>English Now</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: "Chewy",
  },
});
