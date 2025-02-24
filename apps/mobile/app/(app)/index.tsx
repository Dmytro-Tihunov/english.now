import { Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { LinearGradient } from "expo-linear-gradient";
import CourseSwiper from "@/components/app/CourseSwiper";

export default function Index() {
  const { signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#C172FF", "white"]}
        style={styles.fadeBackground}
      ></LinearGradient>
      <Header />
      <Text style={styles.title}>Доступні курси</Text>
      <CourseSwiper />
      <Button title="Sign Out" onPress={() => signOut()}></Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    paddingHorizontal: 20,
  },
  fadeBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 22,
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
  socialButtons: {
    gap: 16,
  },
  appleButton: {
    height: 48,
  },
  text: {
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#fff",
  },
});
