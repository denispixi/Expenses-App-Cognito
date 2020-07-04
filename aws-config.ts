import Auth from '@aws-amplify/auth'
import { openAuthSessionAsync, dismissBrowser, openBrowserAsync } from 'expo-web-browser'
import { Platform, Linking } from 'react-native'
export default {
  // development
  Auth: {
    identityPoolId: "us-east-2:6c85b564-3454-4d54-86b9-8a9d0f549af6",
    mandatorySignIn: true,
    region: "us-east-2",
    userPoolId: "us-east-2_LYe414i1U",
    userPoolWebClientId: "6su9p5ovlbr4u2kqo3p0h4tda",
    oauth: {
      domain: "expense-tracker-dev.auth.us-east-2.amazoncognito.com",
      redirectSignIn: "xpenztrackr://",
      redirectSignOut: "xpenztrackr://xpenztrackr-logout",
      responseType: "code",
      scope: ["phone", "email", "profile", "openid", "aws.cognito.signin.user.admin"],
      urlOpener: async (url: string, redirectUrl: string) => {
        console.log({ url, redirectUrl })
        // On Expo, use WebBrowser.openAuthSessionAsync to open the Hosted UI pages.
        // @ts-ignore
        // const { type, url: newUrl } = await openAuthSessionAsync(url, redirectUrl, {
        //   showInRecents: false
        // })
        const gg = await openBrowserAsync(url)
        console.log({ gg })
        // console.log({ type, newUrl })
        // if (type === 'success' && Platform.OS === 'ios') {
        //   dismissBrowser()
        //   return Linking.openURL(newUrl)
        // }
      }
    }
  },
  API: {
    endpoints: [{
      name: "dev-expense-tracker-project",
      endpoint: "https://kn24zbaqqd.execute-api.us-east-2.amazonaws.com/dev",
      region: "us-east-2",
      custom_header: async () => {
        const user = await Auth.currentUserInfo()
        console.log(user.attributes.sub)
        return { "expense-tracker-user-id": user.attributes.sub }
      }
    }]
  }
}