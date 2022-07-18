Reference: https://itnext.io/aws-amplify-react-native-authentication-full-setup-7764b452a138

1. Install expo and create react native project with expo https://reactnative.dev/docs/environment-setup
2. Register AWS account
3. Setup Amplify CLI, use a profile to configure if multiple accounts are being used. File located in ~/.aws/config or `aws configure list-profiles`
4. Run `amplify init` and select the configuration for your project (screenshot), once the configuration has finished the process takes a few minutes to initialize.
5. Connect the authentication with cognito using `amplify add auth`. In the redirect URI use localhost since the development is react native, this is just for development purposes NOT production.
5a. Connect FB, go to https://developers.facebook.com and create an App ID. (screenshots) only use the id, no need to other setup. You can find the App Secret under the Settings > Basic on your Facebook app 
5b. Connect Google, go to https://developers.google.com/identity and create an App ID. You'll need to create a developer profile and follow: https://aws.amazon.com/premiumsupport/knowledge-center/cognito-google-social-identity-provider/
6. Push the changes into the cloud with `amplify push`, when the push process has been completed you'll get the "Hosted UI Endpoint" and "Test Your Hosted UI Endpoint" url.
Note: 
Hosted UI Endpoint: https://dd-dev-dev.auth.ap-southeast-2.amazoncognito.com/
Test Your Hosted UI Endpoint: https://dd-dev-dev.auth.ap-southeast-2.amazoncognito.com/login?response_type=code&client_id=6jhtd3qe967q31tjn9fc9ghttk&redirect_uri=http://localhost:3000/

7. Once you push the changes you need to update the google javascript authorised origins with the Hosted UI Endpoint displayed after the command push.

8. Connect Amplify with the React native application
Run: `yarn add aws-amplify @aws-amplify/core aws-amplify-react-native @react-native-community/netinfo`

9. Use the `Authenticator` from Amplify for the base authentication with email

10. To login with Facebook and Google we will use the Amplify Hub
10.a) Check the Facebook Auth redirect URI, it needs to be something like `https://<your-user-pool-domain>/oauth2/idpresponse`
    source: `https://docs.amplify.aws/lib/auth/social/q/platform/js/#setup-your-auth-provider`
    - What to include as redirect in AWS cognito config?
    - What to include as FB oatuh redirect URI?

11. Open FB login with FB app?

<!-- 9. Amplify configure in the application with `amplify configure` -->

