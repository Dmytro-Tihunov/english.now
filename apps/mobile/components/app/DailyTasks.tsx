import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function DailyTasks() {
  const dailyTasks = [
    { id: 1, title: "Learn 5 new words", completed: false },
    { id: 2, title: "Practice pronunciation for 10 minutes", completed: false },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Щоденні завдання</Text>
        <ScrollView style={styles.taskList}>
          {dailyTasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.checkbox} />
              <Text style={styles.taskText}>{task.title}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#4a90e2",
    marginRight: 12,
  },
  taskText: {
    fontSize: 16,
    color: "#444",
  },
});
