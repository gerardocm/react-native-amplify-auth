import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Amplify from '@aws-amplify/core'
import awsconfig from './src/aws-exports'
// @ts-ignore 
import { Authenticator, withAuthenticator } from 'aws-amplify-react-native'

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
})
const signUpConfig = {
  header: 'My Customized Sign Up',
  hideAllDefaults: true,
  defaultCountryCode: '1',
  signUpFields: [
    {
      label: 'Email',
      key: 'email',
      required: true,
      displayOrder: 1,
      type: 'string'
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 2,
      type: 'password'
    },
  ]
};

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Authenticator usernameAttributes="email" signUpConfig={ signUpConfig }/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;