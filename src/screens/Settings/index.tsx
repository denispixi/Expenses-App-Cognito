import React from 'react'
import { View, ScrollView, StyleSheet, Alert } from 'react-native'
import Auth from '@aws-amplify/auth'
import { useTheme } from '@react-navigation/native'
import { useStoreState, useStoreActions } from '../../store'
import { SizedBox, Text, RadioButton } from '../../components'
import { Themes } from '../../utils/constants'
import { TouchableOpacity } from 'react-native-gesture-handler'

function SettingsScreen() {
  const { theme } = useStoreState(state => state.Settings)
  const { setTheme } = useStoreActions(actions => actions.Settings)
  const { colors } = useTheme()

  function askLogout() {
    Alert.alert('Cerrar sesión', '¿Desea salir de Expense Tracker?', [
      { text: "Salir", style: "default", onPress: logout },
      { text: "Cancelar", style: "cancel" },
    ])
  }

  async function logout() {
    await Auth.signOut()
  }

  function onSelectTheme(theme: Themes) {
    setTheme(theme)
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Tema</Text>
      <View style={[styles.settingsBlock, { backgroundColor: colors.card }]}>
        <RadioButton
          selectedValue={theme}
          onChange={onSelectTheme}
          options={[
            { label: 'Claro', value: Themes.LIGTH },
            { label: 'Oscuro', value: Themes.DARK },
            { label: 'Sistema', value: Themes.SYSTEM },
          ]} />
      </View>
      <SizedBox height={30} />
      <TouchableOpacity onPress={askLogout}>
        <Text style={[styles.logoutButtonText, { color: colors.primary, }]}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  settingsBlock: {
    margin: 5,
    borderRadius: 5,
    padding: 10
  },
  header: {
    margin: 5,
    fontWeight: 'bold',
    fontSize: 25,
  },
  logoutButtonText: {
    fontSize: 20,
    textAlign: 'center'
  }
})

export default SettingsScreen