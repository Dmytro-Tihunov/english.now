import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useCourseData } from "@/hooks/useCourseData";
import CommonBottomSheet from "../common/CommonBottomSheet";
import AppBottomSheetCourseContent from "../app/AppBottomSheetCourseContent";

interface CoursePathHeadProps {
  courseId: number;
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
  const [showCourseBottomSheet, setShowCourseBottomSheet] = useState(false);

  const closeCourseBottomSheet = () => {
    setShowCourseBottomSheet(false);
  };
  const { courses, isLoading } = useCourseData();

  const progressPercentage = Math.round(
    (completedLessons / totalLessons) * 100,
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* <View style={[styles.iconContainer, { backgroundColor: getBgColor() }]}>
          <A1 style={{ width: 34, height: 34 }} />
        </View> */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Pressable
              onPress={() => setShowCourseBottomSheet(true)}
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Text style={styles.title}>{level} -</Text>
                <Text style={styles.title}>{title}</Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  padding: 2,
                  borderRadius: 100,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 5,
                }}
              >
                {showCourseBottomSheet ? (
                  <Ionicons name="chevron-up" size={14} color="#000" />
                ) : (
                  <Ionicons name="chevron-down" size={14} color="#000" />
                )}
              </View>
            </Pressable>

            <Pressable onPress={onInfoPress} style={styles.infoButton}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color="#999"
              />
            </Pressable>
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

      {/* Course Bottom Sheet */}
      <CommonBottomSheet
        isVisible={showCourseBottomSheet}
        onClose={closeCourseBottomSheet}
      >
        <AppBottomSheetCourseContent />
      </CommonBottomSheet>
    </View>
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
    borderRadius: 14,
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
    marginBottom: 8,
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
    backgroundColor: "#01C159",
  },
  lessonsText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  progressTextContainer: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
