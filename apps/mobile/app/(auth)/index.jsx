import { View, Button, Text, StyleSheet, TextInput } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { authClient } from "../../lib/auth-client";
import { useEffect, useState } from 'react';

const Welcome = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { data: session } = authClient.useSession();

    const handleLogin = async () => {
        // await authClient.signIn.social({
        //     provider: 'google',
        // });
        await authClient.signUp.email({
                email,
                password,
                name: 'test',
                image: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
        })
    };

    return (
        <View  style={styles.container}>
            <Text  style={{ $$css: true, _: 'text-5xl text-red' }}>Привіт dasasце я</Text>
            <Text>Welcome, {session}</Text>
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
            await authClient.signIn.social({
                provider: 'apple',
                idToken: {
                    token: credential.identityToken,
                }
            })
            // signed in
          } catch (e) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
            console.log('ERR_REQUEST_CANCELED', e)
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
              console.log(e)
            }
          }
        }}
      />

      <Button title="Google" onPress={async () => {
          await authClient.signIn.social({  
              provider: 'google',
              callbackURL: '/explore'
          });
      }
      } />
                <Text style={{color: 'red'}}>
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </Text>

                <View>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
         </View>
    )
};

export default Welcome;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    button: {
        width: 300,
        height: 44,
      },
  });