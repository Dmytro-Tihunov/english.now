import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useMemo } from "react";
import { Colors } from "@/constants/Colors";
import Header from "@/components/Header";
import CoursePath from "@/components/course/CoursePath";
import CoursePathHead from "@/components/course/CoursePathHead";

export default function HomeScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const currentGradient = useMemo(() => {
    return (
      Colors.courseHeaderGradients[currentSlide] ||
      Colors.courseHeaderGradients[0]
    );
  }, [currentSlide]);

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <LinearGradient
        colors={["#C089FF", "white"]}
        style={styles.fadeBackground}
      />
      <Header />
      <ScrollView style={{ zIndex: 100, position: "relative", paddingTop: 20 }}>
        <View style={styles.container}>
          <View style={styles.container_secondary}>
            <CoursePathHead
              courseId="1"
              title="English Now"
              level="A1"
              progress={10}
              totalLessons={10}
            />
            <CoursePath />
            {/* <View style={styles.container}>
              <DailyTasks />
            </View>
            <CourseSwiper onSlideChange={setCurrentSlide} />
            <WordsSwiper /> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: "100%",
    padding: 6,
    paddingBottom: 0,
  },
  container_secondary: {
    height: "100%",
    paddingBottom: 0,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.background_secondary,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  fadeBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    height: 200,
  },
});
