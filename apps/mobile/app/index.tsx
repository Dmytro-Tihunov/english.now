import { Stack } from "expo-router";
import { View, Button, Text, StyleSheet } from "react-native";
import React from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { authClient } from "../lib/auth-client";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthProvider";

export default function Welcome() {
  const router = useRouter();
  const { session } = useAuth();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View
          style={{
            marginBottom: 20,
            width: 100,
            height: 100,
            backgroundColor: "red",
            borderRadius: 20,
          }}
        ></View>
        <Text style={{ fontSize: 34, fontWeight: "bold", marginBottom: 10 }}>
          English.now
        </Text>
        <Text style={{ marginBottom: 20, fontSize: 16 }}>
          Час вивчати англійську мову з English.now
        </Text>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={
            AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
          }
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
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
            width: 250,
          }}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  button: {
    width: 300,
    height: 44,
  },
});
