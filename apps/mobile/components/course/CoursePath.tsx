import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCourseData } from "@/hooks/useCourseData";
import CoursePathUnit from "./CoursePathUnit";
import { Unit } from "@/types";

interface Lesson {
  id: string;
  title: string;
  type: string;
  completed: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  units: Unit[];
  progress: number; // 0-100
}

export default function CoursePath() {
  const { courses } = useCourseData();
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const router = useRouter();

  const toggleCourse = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
    setExpandedUnit(null);
  };

  const toggleUnit = (unitId: string) => {
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
  };

  // const navigateToExercise = (
  //   courseId: string,
  //   unitId: string,
  //   lessonId: string,
  //   exerciseId: string,
  // ) => {
  //   // Navigate to the exercise screen with the necessary params
  //   router.push({
  //     pathname: `(index)/${exerciseId}`,
  //     params: { courseId, unitId, lessonId },
  //   });
  // };

  const renderUnit = (lesson: Lesson, courseId: string) => {
    const isExpanded = expandedUnit === lesson.id;

    return (
      <View key={lesson.id} style={styles.unitContainer}>
        <TouchableOpacity
          style={styles.unitHeader}
          onPress={() => toggleUnit(lesson.id)}
        >
          <View style={styles.unitTitleContainer}>
            {lesson.type === "GRAMMAR" ? (
              <View style={styles.grammarIcon}>
                <Ionicons name="book-outline" size={20} color="#4CAF50" />
              </View>
            ) : (
              <View style={styles.grammarIcon}>
                <Ionicons name="flash-outline" size={20} color="#4CAF50" />
              </View>
            )}
            <View style={styles.lessonTitleContainer}>
              <View>
                {lesson.type === "GRAMMAR" ? (
                  <Text>Grammar</Text>
                ) : (
                  <Text>Vocabulary</Text>
                )}
              </View>
              <View>
                <Text style={styles.unitTitle}>{lesson.title}</Text>
              </View>
            </View>
          </View>
          <Button
            title="start"
            onPress={() => {
              router.push(`/course/${courseId}/${lesson.id}`);
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {courses.map((unit: Unit, index: number) => (
        <CoursePathUnit key={unit.id} index={index} {...unit} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  courseContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  lessonTitleContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  courseDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  courseRightContainer: {
    alignItems: "flex-end",
  },
  progressContainer: {
    width: 100,
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  unitsContainer: {
    padding: 8,
  },
  startButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    padding: 8,
  },
  unitContainer: {
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 8,
    marginVertical: 6,
    overflow: "hidden",
  },
  unitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  unitTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#444",
  },
  lessonsContainer: {
    padding: 8,
  },
  lessonContainer: {
    backgroundColor: "white",
    borderRadius: 6,
    marginVertical: 4,
    overflow: "hidden",
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  lessonTitleRowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lessonTitle: {
    fontSize: 15,
    marginLeft: 8,
    color: "#555",
  },
  exercisesContainer: {
    padding: 8,
    backgroundColor: "#f9f9f9",
  },
  exerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 6,
    marginVertical: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#3F51B5",
  },
  exerciseHeader: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 14,
    color: "#333",
  },
  exerciseTypeContainer: {
    backgroundColor: "#E8EAF6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  exerciseType: {
    fontSize: 12,
    color: "#3F51B5",
  },
  statusContainer: {
    marginLeft: 8,
  },
  grammarIcon: {
    backgroundColor: "#E8EAF6",
    padding: 4,
    borderWidth: 1,
    borderColor: "#3F51B5",
    borderRadius: 12,
    marginRight: 8,
  },
});
