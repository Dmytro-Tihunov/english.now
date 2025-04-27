import React, { memo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { IconSymbol } from "./ui/IconSymbol";
import Ionicons from "@expo/vector-icons/Ionicons";
import Course from "./icons/Course";
import CommonBottomSheet from "./common/CommonBottomSheet";
import AppBottomSheetCourseContent from "./app/AppBottomSheetCourseContent";
import AppBottomSheetStreakContent from "./app/AppBottomSheetStreakContent";
import { useAuth } from "../context/AuthProvider";
import AppHeaderLogo from "./app/AppHeaderLogo";
import SubscriptionModal from "./SubscriptionModal";

const Header = memo(() => {
  const { session } = useAuth();
  const [showStreakDrawer, setShowStreakDrawer] = useState(false);
  const [showCourseBottomSheet, setShowCourseBottomSheet] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
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
  }, [showStreakDrawer, slideAnim]);

  return (
    <View style={styles.header}>
      <AppHeaderLogo />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        {session?.user.currentCourseId && (
          <Pressable
            style={styles.btn_course}
            onPress={toggleCourseBottomSheet}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Course course="A1" />
            </View>
          </Pressable>
        )}
        <Pressable style={styles.btn_streak} onPress={toggleStreakDrawer}>
          <Ionicons size={20} color="#000" name="flame" />
          <View>
            <Text style={{ fontWeight: "bold" }}>
              {session?.user.currentStreak}
            </Text>
          </View>
        </Pressable>
        <View style={styles.btn_pro}>
          <Pressable
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => setShowSubscription(true)}
          >
            <IconSymbol size={20} color="#8B4513" name="crown.fill" />
            <Text style={styles.btn_pro_text}>Pro</Text>
          </Pressable>
        </View>
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

      <SubscriptionModal
        visible={showSubscription}
        onClose={() => setShowSubscription(false)}
      />
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
    height: 35,
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    justifyContent: "center",
  },
  btn_course: {
    backgroundColor: "#FF603E",
    borderRadius: 30,
    height: 35,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#000",
  },
  btn_pro: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#FFD700",
    borderRadius: 30,
    height: 35,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#B8860B",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FFD700",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  btn_pro_text: {
    color: "#8B4513",
    fontWeight: "bold",
    textShadowColor: "rgba(255, 215, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  settingsButton: {
    padding: 10,
  },
  settingsText: {
    color: "#007BFF",
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
});

// Add display name for debugging
Header.displayName = "Header";

export default Header;
