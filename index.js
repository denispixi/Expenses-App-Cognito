import 'react-native-gesture-handler'
import { enableScreens } from 'react-native-screens';
enableScreens();
import { AppRegistry } from 'react-native'
import Amplify from '@aws-amplify/core'
import App from './src/App'
import { name as appName } from './app.json'
import awsConfig from "./aws-config"
Amplify.configure(awsConfig);
AppRegistry.registerComponent(appName, () => App);
