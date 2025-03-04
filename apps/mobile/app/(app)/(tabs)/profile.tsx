import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthProvider";
import Header from "@/components/Header";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen() {
  const { signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#FFE99C", "white"]}
        style={styles.fadeBackground}
      />
      <Header />
      <ScrollView style={{ zIndex: 100, position: "relative" }}>
        <View style={styles.content}>
          <Text style={styles.title}>Profile</Text>
          <Button title="Sign Out" onPress={() => signOut()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fadeBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    height: 200,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    gap: 20,
    minHeight: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
