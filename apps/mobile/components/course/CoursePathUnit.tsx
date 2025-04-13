import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Unit, Lesson } from "@/types";
import CoursePathLesson from "./CoursePathLesson";
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

  return (
    <View style={styles.unit}>
      <TouchableOpacity
        style={styles.courseHeader}
        onPress={() => toggleUnit(unit.id)}
      >
        {/* <View style={styles.unitRound}>
          <Text style={styles.unitNumber}>{index + 1}</Text>
        </View> */}
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
  unitRound: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  unitNumber: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  lessonContainer: {
    marginVertical: 6,
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
