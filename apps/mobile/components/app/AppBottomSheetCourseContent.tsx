import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useCourseData } from "@/hooks/useCourseData";
import { courseColors } from "@/constants/Colors";
import Course from "../icons/Course";
import Logo from "../icons/Logo";
import { useState } from "react";

export default function AppBottomSheetCourseContent() {
  const { allCourses, isLoadingAllCourses, errorAllCourses } = useCourseData();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const courseColor = (courseLevel: string) => {
    return courseColors[courseLevel as keyof typeof courseColors];
  };

  const handleCourseSelection = (courseId: number) => {
    setSelectedCourse(courseId);
  };

  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      {/* <Text style={styles.title}>Курси:</Text> */}
      {isLoadingAllCourses && <ActivityIndicator color="#111111" />}
      {errorAllCourses && <Text>Error: {errorAllCourses.message}</Text>}
      {allCourses.length > 0 && (
        <View style={styles.container}>
          {allCourses.map((course) => (
            <Pressable
              onPress={() => handleCourseSelection(course.id)}
              key={course.id}
              style={[
                styles.course,
                {
                  backgroundColor: `${courseColor(course.level).background}20`,
                  borderWidth: selectedCourse === course.id ? 1 : 0,
                  borderColor: "#222",
                },
              ]}
            >
              <View
                style={[
                  styles.courseLevel,
                  {
                    backgroundColor: `${courseColor(course.level).background}`,
                  },
                ]}
              >
                <Course course={course.level} />
              </View>
              <View style={styles.courseContent}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseDescription} numberOfLines={2}>
                  {course.description}
                </Text>
              </View>
              <View style={styles.logoContainer}>
                <Logo course={course.level} rotation={-20} />
              </View>
            </Pressable>
          ))}
        </View>
      )}
      <Pressable
        onPress={() => handleCourseSelection(allCourses[0].id)}
        disabled={selectedCourse === null}
        style={[styles.button, selectedCourse === null && { opacity: 0.5 }]}
      >
        <Text style={styles.buttonText}>Обрати</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 15,
    position: "relative",
  },
  course: {
    borderWidth: 1,
    borderColor: "#222",
    position: "relative",
    overflow: "hidden",
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 15,
  },
  courseLevel: {
    backgroundColor: "gray",
    padding: 5,
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#222222",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  courseContent: {
    flex: 1,
  },
  button: {
    backgroundColor: "#222222",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  courseDescription: {
    fontSize: 12,
    color: "#222222",
    flexWrap: "wrap",
  },
  logoContainer: {
    position: "absolute",
    right: -20,
    top: -35,
  },
});
