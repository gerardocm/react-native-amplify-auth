import * as WebBrowser from 'expo-web-browser';

import { Auth, Hub } from "aws-amplify";
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";

import Amplify from "@aws-amplify/core";
// @ts-ignore
import { Authenticator } from "aws-amplify-react-native";
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { StatusBar } from "expo-status-bar";
import awsconfig from "./src/aws-exports";

interface SocialSignUpProps {
  authenticatorState: string | null
  onPressFacebookSignUp: () => void
  onPressGoogleSignUp: () => void
}

const SocialSignUp = ({
  authenticatorState,
  onPressFacebookSignUp,
  onPressGoogleSignUp
}: SocialSignUpProps) => {
  const socialSignUpStates = ['signIn', 'signedOut', 'signUp']
  if (!socialSignUpStates.includes(authenticatorState ?? '')) {
    return <></>
  }
  return (
    <View style={styles.socialSignUpContainer}>
      <Text style={{textAlign: 'center'}}></Text>
      <TouchableOpacity onPress={onPressFacebookSignUp} style={styles.btnFacebook}>
        <Text style={styles.btnLabelFacebook}>FACEBOOK</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressGoogleSignUp} style={styles.btnGoogle}>
        <Text style={styles.btnLabelGoogle}>GOOGLE</Text>
      </TouchableOpacity>
    </View>
  )
}

// async function urlOpener(url, redirectUrl) {
const urlOpener = async (url: string, redirectUrl: string) => {
  // console.log('url :>> ', url);
  // console.log('redirectUrl :>> ', redirectUrl);
  const { type, url: newUrl } = await WebBrowser.openAuthSessionAsync(
      url,
      redirectUrl
  ) as WebBrowser.WebBrowserRedirectResult;

  if (type === 'success' && Platform.OS === 'ios') {
      WebBrowser.dismissBrowser();
      return Linking.openURL(newUrl);
  }
}

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
  oauth: {
      ...awsconfig.oauth,
      urlOpener,
  },
});

const signUpConfig = {
  header: "How to Sign up",
  hideAllDefaults: true,
  defaultCountryCode: "1",
  signUpFields: [
    {
      label: "Email",
      key: "email",
      required: true,
      displayOrder: 1,
      type: "string",
    },
    {
      label: "Password",
      key: "password",
      required: true,
      displayOrder: 2,
      type: "password",
    },
  ],
};

const App = () => {
  const [user, setUser] = useState(null);
  const [authenticatorState, setAuthenticatorState] = useState<string>('');

  function getUser() {
    console.log("Getting user");
    return Auth.currentAuthenticatedUser()
      .then((userData) => userData)
      .catch(() => console.log("Not signed in"));
  }

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          getUser().then((userData) => setUser(userData));
          break;
        case "signOut":
          setUser(null);
          break;
        case "signIn_failure":
        case "cognitoHostedUI_failure":
          break;
        case 'configured':
          getUser().then((userData) => setUser(userData));
          break;
      }
    });

    getUser().then((userData) => setUser(userData));
  }, []);

  const onPressFacebookSignUp = () => {
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Facebook })
  }

  const onPressGoogleSignUp = () => {
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })
  }

  const handleAuthStateChange = (state: string) => {
    console.log('state :>> ', state);
    setAuthenticatorState(state)
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
        <Authenticator
          usernameAttributes="email"
          signUpConfig={signUpConfig}
          onStateChange={handleAuthStateChange}
          >
          <SocialSignUp
            authenticatorState={authenticatorState}
            onPressGoogleSignUp={onPressGoogleSignUp}
            onPressFacebookSignUp={onPressFacebookSignUp}
          /> 
        </Authenticator>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  btnFacebook: {
    minHeight: 48,
    minWidth: '100%',
    backgroundColor: '#4267B2',
    margin: 12,
    justifyContent: 'center'
  },
  btnLabelFacebook: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500'
  },
  btnGoogle: {
    minHeight: 48,
    minWidth: '100%',
    borderColor: '#4285F4',
    borderWidth: 3,
    margin: 12,
    justifyContent: 'center'
  },
  btnLabelGoogle: {
    color: '#4285F4',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500'
  },
  socialSignUpContainer: {
    margin: 24,
  }
});

export default App;
