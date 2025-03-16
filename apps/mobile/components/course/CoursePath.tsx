import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCourseData } from "@/hooks/useCourseData";

interface Exercise {
  id: string;
  title: string;
  type: "flashcards" | "quiz" | "matching" | "writing";
  completed: boolean;
}

interface Lesson {
  id: string;
  title: string;
  exercises: Exercise[];
  completed: boolean;
}

interface Unit {
  id: string;
  title: string;
  lessons: Lesson[];
  completed: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  units: Unit[];
  progress: number; // 0-100
}

// Mock data - replace with your actual data

const mockCourses: Course[] = [
  {
    id: "c1",
    title: "Essential Vocabulary",
    description: "Learn the most common words used in everyday conversations",
    progress: 45,
    units: [
      {
        id: "u1",
        title: "Basics",
        completed: true,
        lessons: [
          {
            id: "l1",
            title: "Greetings",
            completed: true,
            exercises: [
              {
                id: "e1",
                title: "Common Greetings",
                type: "flashcards",
                completed: true,
              },
              {
                id: "e2",
                title: "Practice Greetings",
                type: "quiz",
                completed: true,
              },
            ],
          },
          {
            id: "l2",
            title: "Numbers",
            completed: true,
            exercises: [
              {
                id: "e3",
                title: "Numbers 1-10",
                type: "flashcards",
                completed: true,
              },
              {
                id: "e4",
                title: "Practice Numbers",
                type: "matching",
                completed: true,
              },
            ],
          },
        ],
      },
      {
        id: "u2",
        title: "Daily Life",
        completed: false,
        lessons: [
          {
            id: "l3",
            title: "Food Vocabulary",
            completed: true,
            exercises: [
              {
                id: "e5",
                title: "Common Foods",
                type: "flashcards",
                completed: true,
              },
              {
                id: "e6",
                title: "Restaurant Phrases",
                type: "writing",
                completed: true,
              },
            ],
          },
          {
            id: "l4",
            title: "Shopping Terms",
            completed: false,
            exercises: [
              {
                id: "e7",
                title: "Store Vocabulary",
                type: "flashcards",
                completed: false,
              },
              {
                id: "e8",
                title: "Practice Shopping",
                type: "quiz",
                completed: false,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default function CoursePath() {
  const { courses, isLoading } = useCourseData();
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const router = useRouter();

  const toggleCourse = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
    setExpandedUnit(null);
    setExpandedLesson(null);
  };

  const toggleUnit = (unitId: string) => {
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
    setExpandedLesson(null);
  };

  const toggleLesson = (lessonId: string) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const navigateToExercise = (
    courseId: string,
    unitId: string,
    lessonId: string,
    exerciseId: string,
  ) => {
    // Navigate to the exercise screen with the necessary params
    router.push({
      pathname: `(index)/${exerciseId}`,
      params: { courseId, unitId, lessonId },
    });
  };

  const renderExercise = (
    exercise: Exercise,
    courseId: string,
    unitId: string,
    lessonId: string,
  ) => {
    return (
      <TouchableOpacity
        key={exercise.id}
        style={styles.exerciseItem}
        onPress={() =>
          navigateToExercise(courseId, unitId, lessonId, exercise.id)
        }
      >
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
          <View style={styles.exerciseTypeContainer}>
            <Text style={styles.exerciseType}>{exercise.type}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          {exercise.completed ? (
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          ) : (
            <Ionicons name="ellipse-outline" size={20} color="#757575" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderLesson = (lesson: Lesson, courseId: string, unitId: string) => {
    const isExpanded = expandedLesson === lesson.id;

    return (
      <View key={lesson.id} style={styles.lessonContainer}>
        <TouchableOpacity
          style={styles.lessonHeader}
          onPress={() => toggleLesson(lesson.id)}
        >
          <View style={styles.lessonTitleContainer}>
            {lesson.completed ? (
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            ) : (
              <Ionicons name="ellipse-outline" size={18} color="#757575" />
            )}
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#555"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.exercisesContainer}>
            {lesson.exercises.map((exercise) =>
              renderExercise(exercise, courseId, unitId, lesson.id),
            )}
          </View>
        )}
      </View>
    );
  };

  const renderUnit = (unit: Unit, courseId: string) => {
    const isExpanded = expandedUnit === unit.id;

    return (
      <View key={unit.id} style={styles.unitContainer}>
        <TouchableOpacity
          style={styles.unitHeader}
          onPress={() => toggleUnit(unit.id)}
        >
          <View style={styles.unitTitleContainer}>
            {unit.completed ? (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            ) : (
              <Ionicons name="time-outline" size={20} color="#FF9800" />
            )}
            <Text style={styles.unitTitle}>{unit.title}</Text>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.lessonsContainer}>
            {unit.lessons.map((lesson) =>
              renderLesson(lesson, courseId, unit.id),
            )}
          </View>
        )}
      </View>
    );
  };

  const renderCourse = (course: Course) => {
    const isExpanded = expandedCourse === course.id;

    return (
      <View key={course.id} style={styles.courseContainer}>
        <TouchableOpacity
          style={styles.courseHeader}
          onPress={() => toggleCourse(course.id)}
        >
          <View>
            <Text style={styles.courseTitle}>{course.title}</Text>
          </View>
          <View style={styles.courseRightContainer}>
            <Text style={styles.progressText}>1/8</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.unitsContainer}>
            {course.units.map((unit) => renderUnit(unit, course.id))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {mockCourses.map(renderCourse)}
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
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
  unitContainer: {
    backgroundColor: "#f5f5f5",
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
  lessonTitleContainer: {
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
});
