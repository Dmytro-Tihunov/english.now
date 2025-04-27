import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Lesson } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

export default function CoursePathLesson(lesson: Lesson) {
  const getLessonColor = () => {
    return lesson.type === "GRAMMAR" ? "#FF8B4A" : "#4CAF50";
  };

  return (
    <View style={styles.lesson}>
      <View style={styles.lessonHeader}>
        <View style={styles.unitTitleContainer}>
          {lesson.type === "GRAMMAR" ? (
            <View
              style={[
                styles.grammarIcon,
                { backgroundColor: getLessonColor() },
              ]}
            >
              <Ionicons name="book" size={18} color="#ffffff" />
            </View>
          ) : (
            <View
              style={[
                styles.grammarIcon,
                { backgroundColor: getLessonColor() },
              ]}
            >
              <Ionicons name="flash" size={18} color="#ffffff" />
            </View>
          )}
          <View style={styles.lessonTitleContainer}>
            {/* <View>
              {lesson.type === "GRAMMAR" ? (
                <Text style={styles.lessonType}>Граматика</Text>
              ) : (
                <Text style={styles.lessonType}>Словник</Text>
              )}
            </View> */}
            <View>
              <Text style={styles.unitTitle}>{lesson.title}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.lessonButton}
          onPress={() => {
            router.push(`/lessons/${lesson.id}`);
          }}
        >
          <Text style={styles.lessonButtonText}>Почати</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lesson: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 10,
    borderRadius: 10,
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  unitTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lessonTitleContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  grammarIcon: {
    width: 35,
    height: 35,
    marginRight: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  unitTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#202937",
  },
  lessonType: {
    fontSize: 12,
    color: "#6B7280",
  },
  lessonButton: {
    backgroundColor: "#202937",
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 30,
  },
  lessonButtonText: {
    color: "#fff",
  },
});
