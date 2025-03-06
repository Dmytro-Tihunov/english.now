import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCourseData } from "@/hooks/useCourseData";

interface CoursePathHeadProps {
  courseId: string;
  title: string;
  level: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  onInfoPress?: () => void;
  onPress?: () => void;
}

export default function CoursePathHead({
  courseId,
  title,
  level,
  progress,
  totalLessons,
  completedLessons,
  onInfoPress,
  onPress,
}: CoursePathHeadProps) {
  const { courses, isLoading } = useCourseData();
  // Calculate progress percentage
  const progressPercentage = Math.round(
    (completedLessons / totalLessons) * 100,
  );

  // Determine background color based on level
  const getBgColor = () => {
    switch (level) {
      case "A1":
        return "#D6B4F0"; // Light purple for A1
      case "A2":
        return "#B4D6F0"; // Light blue for A2
      case "B1":
        return "#B4F0C5"; // Light green for B1
      case "B2":
        return "#F0E2B4"; // Light yellow for B2
      case "C1":
        return "#F0B4B4"; // Light red for C1
      case "C2":
        return "#E2B4F0"; // Light pink for C2
      default:
        return "#D6B4F0"; // Default to A1 color
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: getBgColor() }]}>
          <Text style={styles.levelText}>{level}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Курс: {title}</Text>
            <TouchableOpacity onPress={onInfoPress} style={styles.infoButton}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${progressPercentage}%` }]}
            />
          </View>

          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>
              {progressPercentage}% Пройдено
            </Text>

            <Text style={styles.lessonsText}>
              {completedLessons}/{totalLessons}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 2,
    marginBottom: 20,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  levelText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  infoContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  infoButton: {},
  progressText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  lessonsText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  progressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
