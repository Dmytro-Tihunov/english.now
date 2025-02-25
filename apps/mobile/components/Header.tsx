import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

const Header = () => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.btn_left}>
        <IconSymbol size={26} name="flame.fill" color="#FF0000" />
        <View style={styles.badge}>
          <Text style={{ fontWeight: "bold", fontSize: 10 }}>10</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>English Now</Text>
      <TouchableOpacity style={styles.button}>
        <IconSymbol size={26} name="smiley.fill" color="black" />
      </TouchableOpacity>
    </View>
  );
};

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
  btn_left: {
    display: "flex",
    flexDirection: "row",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  button: {},
  title: {
    fontSize: 26,
    fontFamily: "Chewy",
  },
  badge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    padding: 2,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  settingsButton: {
    padding: 10,
  },
  settingsText: {
    color: "#007BFF",
  },
});

export default Header;
