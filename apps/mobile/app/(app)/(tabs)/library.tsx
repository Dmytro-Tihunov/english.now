import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyLibrary from "@/components/EmptyLibrary";

export default function LibraryScreen() {
  // Mock empty state - in a real app, you would check if there are items in the library
  const hasLibraryItems = false;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ zIndex: 100, position: "relative" }}>
        <View style={styles.content}>
          <Text style={styles.title}>Бібліотека</Text>
          {hasLibraryItems ? (
            <View>
              {/* Library items would go here */}
              <Text>Your library items</Text>
            </View>
          ) : (
            <EmptyLibrary />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
