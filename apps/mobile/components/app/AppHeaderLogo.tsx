import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthProvider";
import AppHeaderLogoIcon from "./AppHeaderLogoIcon";

export default function AppHeaderLogo() {
  const { session } = useAuth();

  return (
    <View style={styles.container}>
      <AppHeaderLogoIcon courseId={session?.user.currentCourseId || 0} />
      <View style={{ flexDirection: "column", gap: 2 }}>
        <Text style={styles.title}>English Now</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={styles.course_text}>
            Привіт,{" "}
            {session?.user?.name?.length && session?.user?.name?.length > 10
              ? session?.user.name.slice(0, 10) + "..."
              : session?.user.name}
            !
          </Text>
        </View>
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
  course_text: {
    fontSize: 12,
    color: "#666",
  },
});
