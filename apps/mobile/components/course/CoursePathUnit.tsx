import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { Unit, Lesson } from "@/types";
import CoursePathLesson from "./CoursePathLesson";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

interface CoursePathUnitProps extends Unit {
  index: number;
}

export default function CoursePathUnit({
  index,
  ...unit
}: CoursePathUnitProps) {
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const isExpanded = expandedUnit === unit.id;

  const toggleUnit = (unitId: string) => {
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
  };

  // Calculate progress based on completed lessons
  const completedLessons = unit.lessons.filter(
    (lesson) => lesson.completed,
  ).length;
  const totalLessons = unit.lessons.length;
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // SVG circle parameters
  const size = 50;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressOffset =
    circumference - (progressPercentage / 100) * circumference;

  return (
    <View style={styles.unit}>
      <TouchableOpacity
        style={styles.courseHeader}
        onPress={() => toggleUnit(unit.id)}
      >
        <View style={styles.unitRound}>
          <Svg width={size} height={size}>
            {/* Background circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E0E0E0"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#4CAF50"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  unit.imageUrl ||
                  `https://picsum.photos/100/100?random=${unit.id}`,
              }}
              style={styles.unitImage}
            />
          </View>
          <View style={styles.markContainer}>
            <Ionicons name="checkmark" size={15} color="white" />
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.unitTitle}>Частина {index + 1}</Text>
          <Text style={styles.courseTitle} numberOfLines={2}>
            {unit.title}
          </Text>
        </View>
        <View style={styles.courseRightContainer}>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#333"
          />
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.lessonContainer}>
          {unit.lessons.map((lesson: Lesson, index: number) => (
            <View key={lesson.id} style={styles.lessonWrapper}>
              <CoursePathLesson {...lesson} />
              {index < unit.lessons.length - 1 && (
                <View style={styles.verticalDivider} />
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  unit: {
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
  unitTitle: {
    fontSize: 11,
    marginBottom: 4,
    color: "#6B7280",
  },
  unitRound: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  markContainer: {
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    borderWidth: 2,
    borderColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: -5,
    bottom: -5,
  },
  mark: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  courseRightContainer: {
    justifyContent: "center",
  },
  imageContainer: {
    width: 40,
    height: 40,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#FF603E",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  unitImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  lessonContainer: {
    flex: 1,
    gap: 10,
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  lessonWrapper: {
    position: "relative",
  },
  verticalDivider: {
    position: "absolute",
    left: 28,
    top: "100%",
    width: 1,
    height: 10,
    backgroundColor: "#E0E0E0",
  },
  courseHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  titleContainer: {
    flex: 1,
    marginRight: 0,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  progressText: {
    fontSize: 12,
  },
  unitsContainer: {
    padding: 16,
  },
});
