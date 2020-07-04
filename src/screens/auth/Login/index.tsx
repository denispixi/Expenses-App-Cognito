import React, { useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Auth from '@aws-amplify/auth'
import { useStoreState, useStoreActions } from '../../../store'
import { Colors } from '../../../utils/constants'
import { SizedBox, Text } from '../../../components'

function LoginScreen() {
  const { authenticating } = useStoreState(state => state.Auth)
  const { setAuthenticating } = useStoreActions(actions => actions.Auth)

  useEffect(() => {
    setAuthenticating(false)
  }, [])

  async function googleLogin() {
    try {
      // @ts-ignore
      await Auth.federatedSignIn({ provider: 'Google' })
    } catch (error) {
      console.log({ error })
    }
  }

  async function facebookLogin() {
    // @ts-ignore
    try {
      // @ts-ignore
      await Auth.federatedSignIn({ provider: 'Facebook' })
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <View style={styles.container}>
      {authenticating ? <>
        <ActivityIndicator size={30} color="black" />
        <Text>Espere...</Text>
      </> : <>
          <TouchableOpacity
            onPress={facebookLogin}
            style={[styles.loginButton, { backgroundColor: Colors.Facebook }]}>
            <Ionicon name="logo-facebook" color="white" size={25} />
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {'   CONTINUAR CON FACEBOOK'}
            </Text>
          </TouchableOpacity>
          <SizedBox />
          <TouchableOpacity
            onPress={googleLogin}
            style={[styles.loginButton, { backgroundColor: Colors.Google }]}>
            <Ionicon name="logo-google" color="white" size={25} />
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {'   CONTINUAR CON GOOGLE'}
            </Text>
          </TouchableOpacity>
        </>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  loginButton: {
    width: '80%',
    height: 40,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    elevation: 2,
    flexDirection: 'row',
  }
})

export default LoginScreen