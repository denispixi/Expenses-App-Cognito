import React, { useEffect, useMemo } from 'react'
import { Linking, useColorScheme, StatusBar } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createNativeStackNavigator } from 'react-native-screens/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { Hub } from '@aws-amplify/core'
import Auth from '@aws-amplify/auth'
import { dismissBrowser } from 'expo-web-browser'
import { useStoreActions, useStoreState } from '../store'
import { LoginScreen } from '../screens'
import HomeRoutes from './MainRoutes'
import { Themes, CustomLightTheme, CustomDarkTheme } from '../utils/constants'
import { ScreenRoutes } from './ScreenRoutes'

// const Stack = createStackNavigator()
const Stack = createNativeStackNavigator()

function Routes() {
  const { setUser, setAuthenticating } = useStoreActions(actions => actions.Auth)
  const { reset: resetExpenses } = useStoreActions(actions => actions.Expense)
  const { reset: resetWallets } = useStoreActions(actions => actions.Wallet)
  const { user } = useStoreState(state => state.Auth)
  const { theme } = useStoreState(state => state.Settings)
  const colorScheme = useColorScheme()

  const getTheme = useMemo(() => {
    switch (theme) {
      case Themes.LIGTH:
        return CustomLightTheme;
      case Themes.DARK:
        return CustomDarkTheme;
      case Themes.SYSTEM:
      default:
        return colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme;
    }
  }, [theme, colorScheme])

  const getStatusBarTheme = useMemo(() => {
    switch (theme) {
      case Themes.LIGTH:
        return 'dark-content';
      case Themes.DARK:
        return 'light-content';
      case Themes.SYSTEM:
      default:
        return colorScheme === 'dark' ? 'light-content' : 'dark-content';
    }
  }, [theme, colorScheme])

  useEffect(() => {
    Linking.addEventListener('url', evt => {
      if (evt.url.includes('xpenztrackr://xpenztrackr-logout')) {
        dismissBrowser()
      }
    })
    Hub.listen('auth', async ({ payload: { event, data } }) => {
      console.log({ event })
      switch (event) {
        case 'signIn':
          setAuthenticating(true)
          dismissBrowser()
          const user = await Auth.currentAuthenticatedUser()
          const { email, name, sub: id } = user?.signInUserSession?.idToken?.payload || {}
          console.log({ email, name, id })
          if (email || name || id) {
            setUser({ email, name, id })
          } else {
            setAuthenticating(false)
          }
          break;
        case 'signOut':
          dismissBrowser()
          setAuthenticating(false)
          setUser(null)
          resetExpenses()
          resetWallets()
          break;
      }
    });
  }, [])

  return (
    <>
      <StatusBar barStyle={getStatusBarTheme} />
      <NavigationContainer theme={getTheme}>
        <Stack.Navigator initialRouteName={ScreenRoutes.LOGIN}>
          {user ?
            <Stack.Screen
              name={ScreenRoutes.EXPENSES}
              component={HomeRoutes}
              options={{ headerShown: false }}
            /> : <>
              <Stack.Screen
                name={ScreenRoutes.LOGIN}
                component={LoginScreen}
                options={{ headerShown: false }}
              />
            </>}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  )
}

export default Routes