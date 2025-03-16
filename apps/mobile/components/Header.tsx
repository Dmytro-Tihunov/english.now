import React, { memo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

const Header = memo(() => {
  const [showStreakDrawer, setShowStreakDrawer] = useState(false);
  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height * 0.5),
  ).current;

  const toggleStreakDrawer = () => {
    setShowStreakDrawer(!showStreakDrawer);
  };

  const closeDrawer = () => {
    setShowStreakDrawer(false);
  };

  useEffect(() => {
    // Reset animation value before starting new animation
    slideAnim.setValue(
      showStreakDrawer ? Dimensions.get("window").height * 0.5 : 0,
    );

    Animated.timing(slideAnim, {
      toValue: showStreakDrawer ? 0 : Dimensions.get("window").height * 0.5,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showStreakDrawer]);

  return (
    <View style={styles.header}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>English Now</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <TouchableOpacity style={styles.btn_course}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>A1</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn_streak}
          onPress={toggleStreakDrawer}
        >
          <IconSymbol size={20} color="#000" name="flame.fill" />
          <View>
            <Text style={{ fontWeight: "bold", fontSize: 10 }}>10</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Streak Drawer Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={showStreakDrawer}
        onRequestClose={closeDrawer}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeDrawer}
        >
          <Animated.View
            style={[
              styles.drawerContainer,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={styles.drawer}
            >
              <View style={styles.drawerHeader}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeDrawer}
                >
                  <IconSymbol size={24} color="#666" name="xmark" />
                </TouchableOpacity>
              </View>
              <Text style={styles.drawerTitle}>Your Streak</Text>

              <View style={styles.streakInfo}>
                <IconSymbol size={40} color="#FF9500" name="flame.fill" />
                <Text style={styles.streakCount}>10</Text>
                <Text style={styles.streakText}>days</Text>
              </View>

              <Text style={styles.streakMessage}>
                Keep learning daily to maintain your streak!
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    zIndex: 100,
    position: "relative",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
  btn_streak: {
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#000",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    justifyContent: "center",
  },
  btn_course: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#000",
  },
  title: {
    fontSize: 24,
    fontFamily: "Chewy",
  },
  settingsButton: {
    padding: 10,
  },
  settingsText: {
    color: "#007BFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  drawerContainer: {
    height: height * 0.5, // 50% of screen height
    width: "100%",
  },
  drawer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "100%",
    alignItems: "center",
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  streakInfo: {
    alignItems: "center",
    marginVertical: 20,
  },
  streakCount: {
    fontSize: 48,
    fontWeight: "bold",
    marginTop: 10,
  },
  streakText: {
    fontSize: 18,
    color: "#666",
  },
  streakMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  drawerHeader: {
    width: "100%",
    flexDirection: "row" as const,
    justifyContent: "center",
    alignItems: "center",
    position: "relative" as const,
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute" as const,
    right: 0,
    top: 0,
    padding: 10,
  },
});

// Add display name for debugging
Header.displayName = "Header";

export default Header;
