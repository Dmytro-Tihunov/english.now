import React, { memo, useState, useRef, useEffect } from "react";
import { Image } from "expo-image";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { IconSymbol } from "./ui/IconSymbol";
import A1 from "./icons/A1";
import CommonBottomSheet from "./common/CommonBottomSheet";
import AppBottomSheetCourseContent from "./app/AppBottomSheetCourseContent";
import AppBottomSheetStreakContent from "./app/AppBottomSheetStreakContent";

const Header = memo(() => {
  const [showStreakDrawer, setShowStreakDrawer] = useState(false);
  const [showCourseBottomSheet, setShowCourseBottomSheet] = useState(false);
  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height * 0.5),
  ).current;

  const toggleStreakDrawer = () => {
    setShowStreakDrawer(!showStreakDrawer);
  };

  const toggleCourseBottomSheet = () => {
    setShowCourseBottomSheet(!showCourseBottomSheet);
  };

  const closeDrawer = () => {
    setShowStreakDrawer(false);
  };

  const closeCourseBottomSheet = () => {
    setShowCourseBottomSheet(false);
  };

  useEffect(() => {
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
          source={require("../assets/images/Logo.svg")}
          style={styles.logo}
        />
        <Text style={styles.title}>English Now</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Pressable style={styles.btn_course} onPress={toggleCourseBottomSheet}>
          <A1 style={{ width: 24, height: 24 }} />
        </Pressable>

        <Pressable style={styles.btn_streak} onPress={toggleStreakDrawer}>
          <IconSymbol size={20} color="#000" name="flame.fill" />
          <View>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>1</Text>
          </View>
        </Pressable>
      </View>

      {/* Course Bottom Sheet */}
      <CommonBottomSheet
        isVisible={showCourseBottomSheet}
        onClose={closeCourseBottomSheet}
      >
        <AppBottomSheetCourseContent />
      </CommonBottomSheet>

      {/* Streak Bottom Sheet */}
      <CommonBottomSheet isVisible={showStreakDrawer} onClose={closeDrawer}>
        <AppBottomSheetStreakContent />
      </CommonBottomSheet>
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
    width: 55,
    height: 55,
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
    backgroundColor: "#FF603E",
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
