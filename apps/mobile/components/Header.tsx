import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

const Header = memo(() => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>English Now</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <TouchableOpacity style={styles.btn_course}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>A1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn_streak}>
          <IconSymbol size={20} color="#000" name="flame.fill" />
          <View>
            <Text style={{ fontWeight: "bold", fontSize: 10 }}>10</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
});

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
});

// Add display name for debugging
Header.displayName = "Header";

export default Header;
