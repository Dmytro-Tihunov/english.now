import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import WelcomeLogo from "./WelcomeLogo";
import { router } from "expo-router";

interface WelcomeContentProps {
  handleOpenPress: () => void;
}

export default function WelcomeContent({
  handleOpenPress,
}: WelcomeContentProps) {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", marginTop: 140 }}>
        <WelcomeLogo />
      </View>
      <View style={{ alignItems: "center", width: "100%" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={{ fontSize: 16 }}>Ласкаво просимо в</Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>English Now!</Text>
        </View>
        <Text
          style={{
            fontSize: 36,
            marginBottom: 10,
            marginTop: 10,
            textAlign: "center",
            color: "#222",
            fontFamily: "DelaGothicOne",
            lineHeight: 40,
          }}
        >
          Вивчайте англійську в 10 разів швидше
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/onboarding")}
          style={{ width: "100%" }}
        >
          <Text
            style={{
              backgroundColor: "#222",
              padding: 18,
              width: "100%",
              display: "flex",
              borderRadius: 40,
              marginTop: 10,
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            Почати
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              fontWeight: "semibold",
            }}
          >
            Вже маєте аккаунт?
          </Text>
          <Pressable onPress={handleOpenPress}>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                color: "#FF603E",
                fontWeight: "bold",
              }}
            >
              Авторизація
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 36,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  fadeBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  button: {
    width: 300,
    height: 44,
  },
  bottomSheetBackground: {
    backgroundColor: "white",
  },
  bottomSheetContent: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  indicator: {
    backgroundColor: "#999",
    width: 40,
  },
});
