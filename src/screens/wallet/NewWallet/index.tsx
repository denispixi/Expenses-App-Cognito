import React, { useState, useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet, ActionSheetIOS } from 'react-native'
import IonIcon from 'react-native-vector-icons/Ionicons'
import * as Services from '../../../services'
import { Colors, WalletTypes } from '../../../utils/constants'
import { SizedBox, Text, Row, TextInput } from '../../../components'
import { useStoreState, useStoreActions } from '../../../store'
import { Wallet } from '../../../store/wallets'
import { useTheme } from '@react-navigation/native'
import { TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler'

type Props = {
  route: {
    params: { wallet?: Wallet }
  }
  navigation: any
}

function EditWalletScreen(props: Props) {
  const [loading, setLoading] = useState(false)
  const [walletType, setWalletType] = useState('')
  const [walletName, setWalletName] = useState('')
  const [funds, setFunds] = useState('')
  const [color, setColor] = useState('')
  const { addWallet, setwallet } = useStoreActions(actions => actions.Wallet)
  const { colors } = useTheme()

  const { wallet } = props.route?.params || {}

  useEffect(() => {
    setWalletName(wallet?.name || '')
    setWalletType(wallet?.walletType || '')
    setFunds(wallet?.funds?.toString() || '')
    setColor(wallet?.color || '')
  }, [])

  function openWalletTypeSelector() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          WalletTypes.CUENTA_DE_AHORROS,
          WalletTypes.TARJETA_DE_CREDITO,
          WalletTypes.EFECTIVO,
          'Cancelar',
        ],
        cancelButtonIndex: 3,
        tintColor: colors.primary,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          setWalletType(WalletTypes.CUENTA_DE_AHORROS)
        } else if (buttonIndex === 1) {
          setWalletType(WalletTypes.TARJETA_DE_CREDITO)
        } else if (buttonIndex === 2) {
          setWalletType(WalletTypes.EFECTIVO)
        }
      }
    );
  }

  const selectColor = (color: string) => () => {
    setColor(color)
  }

  async function saveWallet() {
    setLoading(true)
    const newWallet: Wallet = await Services.saveWallet(
      walletName,
      walletType,
      Number(funds),
      color,
      wallet?._id
    )
    console.log(JSON.stringify(newWallet, null, 2))

    if (wallet?._id) {
      setwallet(newWallet)
    } else {
      addWallet(newWallet)
    }
    props.navigation.goBack()
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.DarkGray} />
        <SizedBox height={20} />
        <Text>Cargando...</Text>
      </View>
    )
  }
  return (
    <View style={styles.container}>

      <Row style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableWithoutFeedback onPress={props.navigation.goBack}>
          <Text style={{ color: colors.primary, fontSize: 17 }}>Cancelar</Text>
        </TouchableWithoutFeedback>
        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Agregar a Billetera</Text>
        <TouchableWithoutFeedback onPress={saveWallet}>
          <Text style={{ color: colors.primary, fontSize: 17 }}>Guardar</Text>
        </TouchableWithoutFeedback>
      </Row>

      <Row style={[styles.inputRow, { borderBottomColor: colors.border }]}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          autoFocus
          onChangeText={text => setWalletName(text)}
          value={walletName}
          placeholder="Cuenta Sueldo" />
      </Row>
      <Row style={[styles.inputRow, { borderBottomColor: colors.border }]}>
        <Text style={styles.label}>Tipo</Text>
        <TextInput
          style={styles.input}
          onTouchStart={openWalletTypeSelector}
          editable={false}
          value={walletType}
          placeholder="Cuenta de Ahorros" />
      </Row>
      <Row style={[styles.inputRow, { borderBottomColor: colors.border }]}>
        <Text style={styles.label}>Fondos</Text>
        <TextInput
          style={styles.input}
          value={`${funds}`}
          onChangeText={text => setFunds(text)}
          keyboardType="numeric"
          placeholder="Fondos" />
      </Row>
      <SizedBox height={30} />
      <View style={{ width: '100%', height: 70 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['hotpink', '#ff3300', '#FF7F11', '#F2AF29', '#33cc00', '#00A878', '#008ae5'].map((colorItem) => {
            return (
              <TouchableWithoutFeedback
                key={colorItem}
                onPress={selectColor(colorItem)}
                style={[styles.colorPickerItem, { borderColor: color === colorItem ? colorItem : 'transparent' }]}>
                <View style={{ borderRadius: 50, height: 40, width: 40, backgroundColor: colorItem }} />
              </TouchableWithoutFeedback>
            )
          })}
        </ScrollView>
      </View>
    </View>
  )
}

export default EditWalletScreen

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between'
  },
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
  colorPickerItem: {
    height: 50,
    width: 50,
    borderRadius: 50,
    padding: 3,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  }
})