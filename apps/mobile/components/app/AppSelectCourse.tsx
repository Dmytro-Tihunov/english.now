import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import { courseColors } from "@/constants/Colors";
import { useCourseData } from "@/hooks/useCourseData";
import { useState, useRef, useEffect } from "react";
import Course from "../icons/Course";
import Logo from "../icons/Logo";
import { LinearGradient } from "expo-linear-gradient";

export default function AppSelectCourse() {
  const { allCourses, isLoadingAllCourses, errorAllCourses } = useCourseData();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(buttonAnimation, {
      toValue: selectedCourse !== null ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedCourse]);

  const courseColor = (courseLevel: string) => {
    return courseColors[courseLevel as keyof typeof courseColors];
  };

  const handleCourseSelection = (courseId: number) => {
    setSelectedCourse(courseId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Оберіть курс</Text>
      {isLoadingAllCourses && <ActivityIndicator color="#111111" />}
      {errorAllCourses && <Text>Error: {errorAllCourses.message}</Text>}
      {allCourses.length > 0 && (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.courseList}>
            {allCourses.map((course) => {
              const color = courseColor(course.level);
              return (
                <Pressable
                  key={course.id}
                  style={[
                    styles.course,
                    selectedCourse === course.id && styles.selectedCourse,
                    {
                      borderColor:
                        selectedCourse === course.id
                          ? color.background
                          : "#EDE9E6",
                    },
                  ]}
                  onPress={() => handleCourseSelection(course.id)}
                >
                  {selectedCourse === course.id ? (
                    <LinearGradient
                      colors={color.gradient}
                      style={StyleSheet.absoluteFill}
                      locations={[0, 0.7]}
                    />
                  ) : null}
                  <View style={styles.courseContent}>
                    <View style={styles.courseHeader}>
                      <View
                        style={[
                          styles.levelBadge,
                          { backgroundColor: color.background },
                        ]}
                      >
                        <Course course={course.level} />
                      </View>
                      <View style={styles.logoContainer}>
                        <Logo course={course.level} rotation={-20} />
                      </View>
                    </View>
                    <View style={styles.courseInfo}>
                      <Text style={styles.courseTitle}>{course.title}</Text>
                      <Text style={styles.courseDescription}>
                        {course.description}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}
      {/* <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [
              {
                translateY: buttonAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
            opacity: buttonAnimation,
          },
        ]}
      >
        <Pressable
          onPress={() => handleCourseSelection(allCourses[0].id)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Обрати</Text>
        </Pressable>
      </Animated.View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: "DelaGothicOne",
    fontWeight: "bold",
    marginBottom: 20,
    color: "#11181C",
  },
  courseList: {
    gap: 15,
    paddingBottom: 20,
  },
  course: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#EDE9E6",
  },
  selectedCourse: {
    borderColor: "transparent",
  },
  courseContent: {
    gap: 12,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000",
  },
  levelText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  logoContainer: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  courseInfo: {
    gap: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#11181C",
  },
  courseDescription: {
    fontSize: 14,
    color: "#687076",
    lineHeight: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
