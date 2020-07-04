import React, { useState, useLayoutEffect, useEffect, useRef } from 'react'
import {
  ScrollView, StyleSheet, ActionSheetIOS, Alert, ImageBackground, Dimensions,
  View, Keyboard, LayoutAnimation, Modal, ActivityIndicator
} from 'react-native'
import { useTheme } from '@react-navigation/native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import ADIcon from 'react-native-vector-icons/AntDesign'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker';
import { Row, Text, TextInput, SizedBox } from '../../../components'
import { useStoreState, useStoreActions } from '../../../store'
import * as Services from '../../../services'
import _ from 'lodash'
import { Expense } from '../../../store/expenses'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function NewExpenseScreen({ navigation }: any) {
  const [amount, setAmount] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const [comments, setComments] = useState('')
  const [imageUri, setImageUri] = useState('')
  const [wallet, setWallet] = useState('')
  const [saving, setSaving] = useState(false)

  const base64Image = useRef('')

  const { colors } = useTheme()
  const { wallets } = useStoreState(state => state.Wallet)
  const { addExpense } = useStoreActions(state => state.Expense)

  useEffect(() => {
    console.log('wallets length', wallets.length)
    setPlaceholder(wallets[_.random(wallets.length - 1, false)]?.name)
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity activeOpacity={.8} onPress={saveExpense}>
          <Text style={{ color: colors.primary, fontSize: 17 }}>Guardar</Text>
        </TouchableOpacity>
      ),
    })
  }, [navigation, wallet])

  async function uploadImageToCloudinary(): Promise<string> {
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/denis-tests/image/upload', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          file: `data:image/jpg;base64,${base64Image.current}`,
          upload_preset: "d0wk2qra",
        }),
      })
      const data = await response.json()
      console.log({ data })
      // cloudImageUri.current = data.secure_url
      return data.secure_url
    }
    catch (error) {
      console.log('error uploading image:::', error.message)
      setSaving(false)
      Alert.alert('Ocurrió un error subiendo la imagen. Inténtalo de nuevo en unos minutos')
      return ''
    }
  }

  async function saveExpense() {
    try {
      setSaving(true)
      const imgUris = []
      if (base64Image.current) {
        const uri = await uploadImageToCloudinary()
        console.log({ uri })
        if (!uri) {
          setSaving(false)
          return
        }
        imgUris.push(uri)
      }
      console.log({ wallet })
      const walletId = wallets.find(w => w.name === wallet)?._id as string
      console.log({ walletId })
      const newExpense: Expense = await Services.registerExpense(Number(amount), comments, walletId, imgUris)
      addExpense(newExpense)
      navigation.goBack()
      // setSaving(false)
    } catch (error) {
      console.log('error saving expense:::', error.message)
      setSaving(false)
      Alert.alert('Ocurrió un error registrando el gasto. Inténtalo de nuevo en unos minutos')
    }
  }

  async function selectImages() {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!')
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [4, 3], // Android Only
        quality: .5,
        base64: true,
      })
      // console.warn(...Object.keys(result))
      if (!result.cancelled) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setImageUri(result.uri)
        base64Image.current = result.base64 as string
      }
    }
  }

  function openWalletSelector() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...wallets.map(wallet => wallet.name), 'Cancelar'],
        cancelButtonIndex: 4,
        tintColor: colors.primary,
      },
      buttonIndex => {
        if (buttonIndex !== 4) {
          setWallet(wallets[buttonIndex].name)
        }
      }
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <Row style={[styles.inputRow, { borderBottomColor: colors.border }]}>
          <Text style={styles.label}>Monto</Text>
          <TextInput
            returnKeyType="done"
            style={styles.input}
            autoFocus
            keyboardType="numeric"
            onChangeText={text => setAmount(text)}
            value={amount}
            onSubmitEditing={Keyboard.dismiss}
            placeholder="433.40" />
        </Row>
        <Row style={[styles.inputRow, { borderBottomColor: colors.border }]}>
          <Text style={styles.label}>Billetera</Text>
          <TextInput
            style={styles.input}
            onTouchStart={openWalletSelector}
            editable={false}
            value={wallet}
            placeholder={placeholder} />
        </Row>
        <Row style={[styles.inputRow, { borderBottomColor: colors.border, height: 80 }]}>
          <Text style={styles.label}>Info. adic.</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={3}
            onChangeText={text => setComments(text)}
            value={comments}
            placeholder="433.40" />
        </Row>

        <View style={{ alignItems: 'center', paddingVertical: 15 }}>
          <TouchableOpacity
            activeOpacity={.9}
            style={{ alignSelf: 'flex-start' }}
            onPress={selectImages}>
            <Row>
              <Text style={{ color: colors.primary, fontSize: 17 }}>Agregar imagen</Text>
              <SizedBox width={10} />
              <FeatherIcon name="camera" color={colors.primary} size={20} />
            </Row>
          </TouchableOpacity>
        </View>

        <SizedBox height={20} />

        {imageUri ? <View style={{ alignItems: 'center' }}>
          <ImageBackground
            source={{ uri: imageUri }}
            style={{ width: SCREEN_WIDTH * .8, height: SCREEN_WIDTH * .8 }}>
            <ADIcon
              name="closecircle"
              color="white"
              onPress={() => setImageUri('')}
              style={{ position: 'absolute', right: -15, top: -15 }}
              size={30} />
          </ImageBackground>
        </View> : null}
      </ScrollView>

      {saving ?
        <LoadingOverlay
          visible
          loadingColor={colors.text}
          backgroundColor={colors.background}
        /> : null}
    </View>
  )
}
type LoadingModal = {
  backgroundColor: string,
  loadingColor: string,
  visible: boolean,
}
function LoadingOverlay({ backgroundColor, visible, loadingColor }: LoadingModal) {
  return (
    <Modal transparent visible={visible}>
      <View style={{ width: '100%', height: '100%', backgroundColor, opacity: .5 }} />
      <View style={{
        position: 'absolute',
        top: 0, bottom: 0,
        left: 0, right: 0,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator color={loadingColor} size="large" />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  inputRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 13,
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 17,
  },
  input: {
    flex: 2,
    fontSize: 17
  },
  addImageButton: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadingOverlay: {
    color: 'red',
    // flex: 1,
    opacity: 1,
    top: 0,
    left: 0,
    position: 'absolute',
    width: 100,
    height: 100
  },
})