import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthProvider";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { top } = useSafeAreaInsets();
  const { session } = useAuth();

  const menuItems = [
    { icon: "person-outline", label: "Edit Profile", onPress: () => {} },
    { icon: "settings-outline", label: "Settings", onPress: () => {} },
    { icon: "help-circle-outline", label: "Help & Support", onPress: () => {} },
    { icon: "information-circle-outline", label: "About", onPress: () => {} },
  ];

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
            <Text style={styles.name}>{session?.user?.email}</Text>
            <Text style={styles.memberSince}>Member since 2024</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon} size={24} color="#333" />
              <Text style={styles.menuItemText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => signOut()}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarContainer: {
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  memberSince: {
    fontSize: 14,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  menuContainer: {
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 16,
  },
  signOutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  signOutText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
  },
});
