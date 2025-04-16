import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Unit, Lesson } from "@/types";
import CoursePathLesson from "./CoursePathLesson";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

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
  const size = 45;
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
          <View style={styles.unitRoundInner}>
            <Text style={styles.unitNumber}>{index + 1}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.unitTitle}>Частина {index + 1}</Text>
          <Text style={styles.courseTitle}>{unit.title}</Text>
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.lessonContainer}>
          {unit.lessons.map((lesson: Lesson) => (
            <CoursePathLesson key={lesson.id} {...lesson} />
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
    color: "#FF603E",
    marginBottom: 4,
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
  unitRoundInner: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#FF603E",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  unitNumber: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  lessonContainer: {
    marginVertical: 6,
    paddingHorizontal: 16,
  },
  courseHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  courseRightContainer: {
    alignItems: "flex-end",
  },
  progressText: {
    fontSize: 12,
  },
  unitsContainer: {
    padding: 16,
  },
});
