import { View, Text, StyleSheet } from "react-native";
import { useCourseData } from "@/hooks/useCourseData";

export default function AppBottomSheetCourseContent() {
  const {
    allCourses,
    isLoadingAllCourses,
    errorAllCourses,
    refetchAllCourses,
  } = useCourseData();

  return (
    <View>
      <Text>Courses</Text>
      {isLoadingAllCourses && <Text>Loading...</Text>}
      {errorAllCourses && <Text>Error: {errorAllCourses.message}</Text>}
      {allCourses.map((course) => (
        <View key={course.id} style={styles.course}>
          <Text>{course.title}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  course: {
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
  },
});
