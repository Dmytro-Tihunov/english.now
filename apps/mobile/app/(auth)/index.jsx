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
        await authClient.signIn.email({
                email,
                password,
            //  name: 'John Doe'
        })
    };

    return (
        <View style={styles.container}>
           {/* <View>{session?.user}</View> */}
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
                },
                callbackURL: '/explore'
            })
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

{ session?.user ? <Text>Welcome {session?.user?.name}</Text> : null }

<Button title="Sign in with Google" onPress={ async() => await authClient.signIn.social({provider: 'google'})} />

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
            <Button title="Sign Out" onPress={ async() => await authClient.signOut() } />
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