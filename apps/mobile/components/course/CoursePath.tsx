import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useCourseData } from "@/hooks/useCourseData";
import CoursePathUnit from "./CoursePathUnit";
import { Unit } from "@/types";

interface Course {
  id: string;
  title: string;
  description: string;
  units: Unit[];
  progress: number;
}

export default function CoursePath() {
  const { courses } = useCourseData();

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
