import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import AppHeaderLogoIcon from "./AppHeaderLogoIcon";

export default function AppHeaderLogo() {
  const { session } = useAuth();
  const [showCourseBottomSheet, setShowCourseBottomSheet] = useState(false);

  const toggleCourseBottomSheet = () => {
    setShowCourseBottomSheet(!showCourseBottomSheet);
  };

  const hasCourse =
    session?.user.currentCourseId && session.user.currentCourseId > 0;

  return (
    <View style={styles.container}>
      <AppHeaderLogoIcon courseId={session?.user.currentCourseId} />
      <View style={{ flexDirection: "column", gap: 2 }}>
        <Text style={styles.title}>English Now</Text>
        <Pressable
          style={[styles.btn_course, !hasCourse && styles.btn_course_empty]}
          onPress={toggleCourseBottomSheet}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={styles.course_text}>Курс не обрано :(</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  title: {
    fontSize: 14,
    fontFamily: "DelaGothicOne",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Chewy",
    color: "#666",
  },
  btn_course: {},
  btn_course_empty: {},
  course_text: {
    fontSize: 12,
    color: "#666",
  },
});
