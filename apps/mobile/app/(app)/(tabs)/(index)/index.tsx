import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useMemo } from "react";
import { Colors } from "@/constants/Colors";
import Header from "@/components/Header";
import CoursePath from "@/components/course/CoursePath";
import CoursePathHead from "@/components/course/CoursePathHead";
import { useCourseData } from "@/hooks/useCourseData";

export default function HomeScreen() {
  const { courses, isLoading, error, refreshCourses } = useCourseData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { top } = useSafeAreaInsets();
  const currentGradient = useMemo(() => {
    return (
      Colors.courseHeaderGradients[currentSlide] ||
      Colors.courseHeaderGradients[0]
    );
  }, [currentSlide]);

  return (
    <View style={{ backgroundColor: "#ffffff", flex: 1, paddingTop: top }}>
      <LinearGradient
        colors={["#FF603E", "white"]}
        style={styles.fadeBackground}
      />
      <Header />
      <ScrollView style={{ zIndex: 100, position: "relative", paddingTop: 10 }}>
        <View style={styles.container}>
          <View style={styles.container_secondary}>
            {isLoading && <ActivityIndicator color="#222" />}
            {error && <Text>Error: {error.message}</Text>}
            {courses.length > 0 && (
              <>
                <CoursePathHead
                  courseId="1"
                  title="English Now"
                  level="A1"
                  completedLessons={10}
                  progress={10}
                  totalLessons={10}
                />
                <CoursePath />
                <View style={styles.finalTest}>
                  <Text>Pass the final test</Text>
                </View>
              </>
            )}
            {/* <View style={styles.container}>
              <DailyTasks />
            </View>
            <CourseSwiper onSlideChange={setCurrentSlide} />
            <WordsSwiper /> */}
          </View>
        </View>
      </ScrollView>
    </View>
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
  finalTest: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
});
