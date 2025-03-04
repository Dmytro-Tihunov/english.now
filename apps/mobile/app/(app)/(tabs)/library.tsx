import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/Header";
import EmptyLibrary from "@/components/EmptyLibrary";

export default function LibraryScreen() {
  // Mock empty state - in a real app, you would check if there are items in the library
  const hasLibraryItems = false;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#FFE99C", "white"]}
        style={styles.fadeBackground}
      />
      <Header />
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
    backgroundColor: "#ffffff",
  },
  fadeBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    height: 200,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
