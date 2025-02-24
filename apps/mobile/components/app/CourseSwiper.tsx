import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";

const CourseSwiper = () => {
  return (
    <Swiper style={styles.wrapper} showsPagination={false}>
      <View style={styles.slide}>
        <Text style={styles.text}>Slide 1</Text>
      </View>
      <View style={styles.slide}>
        <Text style={styles.text}>Slide 2</Text>
      </View>
      <View style={styles.slide}>
        <Text style={styles.text}>Slide 3</Text>
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 150,
  },
  slide: {
    height: 150,
    width: 250,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#9DD6EB",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default CourseSwiper;
