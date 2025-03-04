import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EmptyLibrary = () => {
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.95);
  const lineOneAnim = new Animated.Value(0);
  const lineTwoAnim = new Animated.Value(0);
  const clockAnim = new Animated.Value(0);

  useEffect(() => {
    // Card animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered line animations
    Animated.stagger(300, [
      Animated.timing(lineOneAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(lineTwoAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Clock animation - continuous rotation
    Animated.loop(
      Animated.timing(clockAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const clockRotation = clockAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.contentContainer}>
          <Animated.View
            style={[
              styles.line,
              styles.lineOne,
              {
                opacity: lineOneAnim,
                transform: [
                  {
                    translateX: lineOneAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.line,
              styles.lineTwo,
              {
                opacity: lineTwoAnim,
                transform: [
                  {
                    translateX: lineTwoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
        <Animated.View
          style={[
            styles.clockContainer,
            { transform: [{ rotate: clockRotation }] },
          ]}
        >
          <Ionicons name="time-outline" size={24} color="#4F7DF3" />
        </Animated.View>
      </View>
      <Animated.Text style={[styles.message, { opacity: fadeAnim }]}>
        Your learning materials will appear here
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 300,
    height: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  line: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F0F0F0",
    marginBottom: 15,
  },
  lineOne: {
    width: "80%",
  },
  lineTwo: {
    width: "60%",
  },
  clockContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
});

export default EmptyLibrary;
