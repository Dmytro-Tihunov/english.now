import { Stack } from "expo-router";
import { View, Button, Text, StyleSheet, Pressable } from "react-native";
import React, { useCallback, useRef } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { authClient } from "../lib/auth-client";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import WelcomeContent from "../components/welcome/WelcomeContent";
import * as Linking from "expo-linking";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

export default function Welcome() {
  const router = useRouter();

  // Bottom sheet ref and snap points
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Callbacks for bottom sheet
  const handleOpenPress = useCallback(() => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0);
    } else {
      console.log("Bottom sheet ref is null");
    }
  }, []);

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={["#FF603E", "#FF603E", "white"]}
          locations={[0, 0.2, 0.7]}
          style={styles.fadeBackground}
        />
        <WelcomeContent handleOpenPress={handleOpenPress} />
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.indicator}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Авторизація</Text>

            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={5}
              style={styles.button}
              onPress={async () => {
                try {
                  const credential = await AppleAuthentication.signInAsync({
                    requestedScopes: [
                      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                      AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    ],
                  });
                  const data = await authClient.signIn.social({
                    provider: "apple",
                    idToken: {
                      token: credential.identityToken ?? "",
                    },
                  });
                  console.log(data);
                  if (data.data) {
                    router.push("/(app)");
                  }
                } catch (e) {
                  if (e) {
                    console.log("ERR_REQUEST_CANCELED", e);
                    // handle that the user canceled the sign-in flow
                  } else {
                    // handle other errors
                    console.log(e);
                  }
                }
              }}
            />
            <Button
              title="Sign in with Google"
              onPress={async () =>
                await authClient.signIn.social({ provider: "google" })
              }
            />
            <Text
              style={{
                marginTop: 20,
                fontSize: 12,
                textAlign: "center",
                width: 350,
                marginBottom: 30,
              }}
            >
              Продовжуючи, ви погоджуєтесь з нашими{" "}
              <Pressable onPress={() => Linking.openURL("https://google.com")}>
                <Text style={{ color: "#FF603E", fontSize: 12 }}>
                  Умовами використання
                </Text>
              </Pressable>{" "}
              та{" "}
              <Pressable onPress={() => Linking.openURL("https://google.com")}>
                <Text style={{ color: "#FF603E", fontSize: 12 }}>
                  Політикою конфіденційності
                </Text>
              </Pressable>
            </Text>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
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
