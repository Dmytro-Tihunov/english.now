import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthProvider";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <ScrollView style={{ zIndex: 100, position: "relative" }}>
        <View>
          <View style={styles.header}>
            <View style={styles.avatar}></View>
            <Text style={styles.name}>John Doe</Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Profile</Text>
          <Button title="Sign Out" onPress={() => signOut()} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 20,
    minHeight: 400,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 20,
    minHeight: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "gray",
  },
});
