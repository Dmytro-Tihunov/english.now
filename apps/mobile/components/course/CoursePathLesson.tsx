import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import { Lesson } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CoursePathLesson(lesson: Lesson) {
  return (
    <View style={styles.lesson}>
      <TouchableOpacity
        style={styles.unitHeader}
        onPress={() => {
          router.push(`/${lesson.id}`);
        }}
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
            router.push(`/${lesson.id}`);
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  lesson: {
    padding: 16,
  },
  unitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  unitTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lessonTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  grammarIcon: {
    marginRight: 10,
  },
  unitTitle: {
    fontSize: 16,
  },
});
