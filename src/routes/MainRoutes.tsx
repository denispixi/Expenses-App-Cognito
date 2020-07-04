import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import { createStackNavigator } from '@react-navigation/stack'
import { createNativeStackNavigator } from 'react-native-screens/native-stack'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useTheme } from '@react-navigation/native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'
import {
  SettingsScreen,
  WalletsScreen,
  EditWalletScreen,
  ExpenseListScreen,
  NewExpenseScreen
} from '../screens'
import { ScreenRoutes } from './ScreenRoutes'

const Tab = createBottomTabNavigator()
// const Stack = createStackNavigator()
const Stack = createNativeStackNavigator()

// PANTALLA DEL TAB DE GASTOS
function HomeStack() {
  const { colors } = useTheme()
  return (
    <Stack.Navigator screenOptions={{ gestureEnabled: true }}>
      <Stack.Screen
        name={ScreenRoutes.EXPENSES}
        component={ExpenseListScreen}
        options={({ navigation }) => ({
          title: 'Gastos',
          headerLargeTitle: true,
          headerRight: () => (
            <TouchableWithoutFeedback onPress={() => navigation.navigate(ScreenRoutes.NEW_WALLET)}>
              <FeatherIcon name="plus" color={colors.primary} size={27} />
            </TouchableWithoutFeedback>
          )
        })}
      />
      <Stack.Screen
        name={ScreenRoutes.NEW_WALLET}
        component={NewExpenseScreen}
        options={{
          title: 'Nuevo gasto',
        }}
      />
    </Stack.Navigator>
  )
}

// PANTALLAS DEL TAB DE BILLETERAS
function WalletStack() {
  const { colors } = useTheme()
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreenRoutes.WALLET}
        component={WalletsScreen}
        options={({ navigation }) => ({
          title: 'Billetera',
          headerRight: () => (
            <TouchableWithoutFeedback onPress={() => navigation.navigate(ScreenRoutes.NEW_WALLET)}>
              <FeatherIcon name="plus" color={colors.primary} size={27} />
            </TouchableWithoutFeedback>
          )
        })}
      />
      <Stack.Screen
        name={ScreenRoutes.NEW_WALLET}
        component={EditWalletScreen}
        options={{
          title: 'Crear Billetera',
          stackPresentation: 'modal'
        }}
      />
    </Stack.Navigator>
  )
}

// PANTALLAS DEL TAB DE SETTINGS
function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreenRoutes.EXPENSES}
        component={SettingsScreen}
        options={{ title: 'Ajustes' }}
      />
    </Stack.Navigator>
  )
}

// TABS INFERIORES PRINCIPALES
function MainRoutes() {
  return (
    <Tab.Navigator lazy={false} tabBarOptions={{ showLabel: true }}>
      <Tab.Screen
        name="main-stack"
        component={HomeStack}
        options={{
          title: 'Gastos',
          tabBarIcon: ({ color, size }) => (
            <FeatherIcon name="dollar-sign" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="wallet-stack"
        component={WalletStack}
        options={{
          title: 'Billetera',
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcon name="wallet" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="settings-stack"
        component={SettingsStack}
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => (
            <FeatherIcon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default MainRoutes