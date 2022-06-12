Reference: https://itnext.io/aws-amplify-react-native-authentication-full-setup-7764b452a138

1. Install expo and create react native project with expo https://reactnative.dev/docs/environment-setup
2. Register AWS account
3. Setup Amplify CLI, use a profile to configure if multiple accounts are being used. File located in ~/.aws/config or `aws configure list-profiles`
4. Run `amplify init` and select the configuration for your project (screenshot), once the configuration has finished the process takes a few minutes to initialize.
5. Connect the authentication with cognito using `amplify add auth`. In the redirect URI use localhost since the development is react native, this is just for development purposes NOT production.
5a. Connect FB, go to https://developers.facebook.com and create an App ID. (screenshots) only use the id, no need to other setup. You can find the App Secret under the Settings > Basic on your Facebook app 
5b. Connect Google, go to https://developers.google.com/identity and create an App ID. You'll need to create a developer profile and follow: https://aws.amazon.com/premiumsupport/knowledge-center/cognito-google-social-identity-provider/
6. Push the changes into the cloud with `amplify push`
Note: 
Hosted UI Endpoint: https://devauth-dev.auth.ap-southeast-2.amazoncognito.com/
Test Your Hosted UI Endpoint: https://devauth-dev.auth.ap-southeast-2.amazoncognito.com/login?response_type=code&client_id=6t1l803n0ln0guguf3qj5chimk&redirect_uri=http://localhost:3000/

7. Once you push the changes you can update the google javascript authorised origins with the Hosted UI Endpoint displayed after the command push.

8. Connect Amplify with the React native application
Run: `yarn add aws-amplify @aws-amplify/core aws-amplify-react-native @react-native-community/netinfo`

9. Amplify configure in the application with `Amplify.configure`

