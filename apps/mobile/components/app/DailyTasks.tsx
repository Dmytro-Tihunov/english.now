import { View, Text, StyleSheet } from "react-native";

export default function DailyTasks() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Навчальний прогресс</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 15,
            padding: 10,
            marginTop: 10,
            backgroundColor: "#F5F5F5",
            borderColor: "#C089FF",
            borderStyle: "dashed",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: "red",
              }}
            />
            <View>
              <Text>Щоденне завдання</Text>
              <Text>1/5</Text>
            </View>
            <View>
              <Text>10:00</Text>
            </View>
          </View>
        </View>
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
});
