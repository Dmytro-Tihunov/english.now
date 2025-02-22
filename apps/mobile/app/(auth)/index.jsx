import { View, Button, Text, StyleSheet } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "expo-router";

const Welcome = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  return (
    <View style={styles.container}>
      <Text className="text-xl font-bold bg-blue-400">Welcome to the app</Text>
      <Text style={{ marginBottom: 20 }}>
        Sign up or log in to continue to the app
      </Text>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
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
            const test = await authClient.signIn.social({
              provider: "apple",
              idToken: {
                token: credential.identityToken,
              },
            });
            if (test) {
              router.push("/explore");
            }
          } catch (e) {
            if (e.code === "ERR_REQUEST_CANCELED") {
              console.log("ERR_REQUEST_CANCELED", e);
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
              console.log(e);
            }
          }
        }}
      />

      {session?.user ? <Text>Welcome {session?.user?.name}</Text> : null}

      <Button
        title="Sign in with Google"
        onPress={async () =>
          await authClient.signIn.social({ provider: "google" })
        }
      />

      <Text>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </View>
  );
};

export default Welcome;

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
