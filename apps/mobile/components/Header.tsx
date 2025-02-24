import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

const Header = () => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.button}>
        <IconSymbol size={23} name="flame.fill" color="red" />
      </TouchableOpacity>
      <Text style={styles.title}>English.now</Text>
      <TouchableOpacity style={styles.button}>
        <IconSymbol size={23} name="flame.fill" color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
  button: {
    backgroundColor: "#f8f9fa",
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  settingsButton: {
    padding: 10,
  },
  settingsText: {
    color: "#007BFF",
  },
});

export default Header;
