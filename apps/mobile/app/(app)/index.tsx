import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { LinearGradient } from "expo-linear-gradient";
import CourseSwiper from "@/components/app/CourseSwiper";
import { useState, useMemo } from "react";

const gradients = [
  ["#FFE99C", "white"] as const, // First slide
  ["#FFE99C", "white"] as const, // Second slide
  ["#FFE99C", "white"] as const, // Third slide
] as const;

export default function Index() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const currentGradient = useMemo(() => {
    return gradients[currentSlide] || gradients[0];
  }, [currentSlide]);

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <LinearGradient colors={currentGradient} style={styles.fadeBackground} />
      <Header />
      <ScrollView style={{ zIndex: 100, position: "relative" }}>
        <View style={styles.container}>
          <View
            style={{
              marginTop: 20,
              height: 200,
              backgroundColor: "#C372FD",
              opacity: 0.3,
              borderRadius: 20,
            }}
          />
        </View>
        <CourseSwiper onSlideChange={setCurrentSlide} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
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
