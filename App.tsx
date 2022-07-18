import * as WebBrowser from 'expo-web-browser';

import { Auth, Hub } from "aws-amplify";
import { Button, Linking, Platform, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";

import Amplify from "@aws-amplify/core";
// @ts-ignore
import { Authenticator } from "aws-amplify-react-native";
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { StatusBar } from "expo-status-bar";
import awsconfig from "./src/aws-exports";

// async function urlOpener(url, redirectUrl) {
const urlOpener = async (url: string, redirectUrl: string) => {
  console.log('url :>> ', url);
  console.log('redirectUrl :>> ', redirectUrl);
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
  header: "My Customized Sign Up",
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

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Authenticator
        usernameAttributes="email"
        signUpConfig={signUpConfig}
        // An object referencing federation and/or social providers
        // The federation here means federation with the Cognito Identity Pool Service
        // *** Only supported on React/Web (Not React Native) ***
        // For React Native use the API Auth.federatedSignIn()
        federated={[]}
      />
      <Button onPress={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Facebook })} title="Facebook" />
      <Button onPress={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })} title="Google" />
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
});

export default App;
