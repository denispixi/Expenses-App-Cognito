import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import FAIcon5 from 'react-native-vector-icons/FontAwesome5'
import IonIcon from 'react-native-vector-icons/Ionicons'
import * as Services from '../../../services'
import { Colors, WalletTypes } from '../../../utils/constants'
import { SizedBox, Text, Row } from '../../../components'
import { useStoreState, useStoreActions } from '../../../store'
import { Wallet } from '../../../store/wallets'
import { ScreenRoutes } from '../../../routes/ScreenRoutes'

function WalletsScreen(props: any) {
  // LOCAL STATE
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  // APP STATE
  const { wallets, cacheLimit } = useStoreState(state => state.Wallet)
  const { setWallets } = useStoreActions(actions => actions.Wallet)

  useEffect(() => {
    const getMyWallets = async () => {
      if (!cacheLimit || cacheLimit < new Date()) {
        setLoading(true)
        const wallets = await Services.getWallets()
        setWallets(wallets)
        setLoading(false)
      }
    }
    getMyWallets()
  }, [])

  function renderIcon(item: Wallet) {
    switch (item.walletType) {
      case WalletTypes.CUENTA_DE_AHORROS:
        return (
          <FAIcon5
            name="piggy-bank"
            color={item.color}
            size={40}
            style={{ alignSelf: 'center' }}
          />
        )
      case WalletTypes.TARJETA_DE_CREDITO:
        return (
          <FAIcon5
            name="credit-card"
            color={item.color}
            size={40}
            style={{ alignSelf: 'center' }}
          />
        )
      case WalletTypes.EFECTIVO:
        return (
          <FAIcon
            name="money"
            color={item.color}
            size={40}
            style={{ alignSelf: 'center' }}
          />
        )
      default:
        return null
    }
  }

  const editWallet = (wallet: Wallet) => () => {
    props.navigation.navigate(ScreenRoutes.NEW_WALLET, { wallet })
  }

  function renderWalletItem({ item }: { item: Wallet }) {
    return (
      <TouchableOpacity activeOpacity={.8} onPress={editWallet(item)} >
        <Row style={{ paddingLeft: 15 }}>
          {renderIcon(item)}
          <SizedBox width={10} />
          <Row style={styles.walletContainer}>
            <View style={{}}>
              <Text style={[styles.walletName, { color: item.color }]}>
                {item.name}
              </Text>
              <Text>
                Fondos: <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                  S/{item.funds.toFixed(2)}
                </Text>
              </Text>
            </View>
            <IonIcon name="ios-arrow-forward" color={item.color} size={30} />
          </Row>
        </Row>
      </TouchableOpacity>
    )
  }

  async function refreshWallets() {
    setRefreshing(true)
    const wallets = await Services.getWallets()
    setWallets(wallets)
    setRefreshing(false)
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
    <View style={{ flex: 1, paddingHorizontal: 0 }}>
      <FlatList
        data={wallets}
        keyExtractor={({ _id }) => _id}
        renderItem={renderWalletItem}
        refreshControl={<RefreshControl
          onRefresh={refreshWallets}
          refreshing={refreshing}
          size={30}
          tintColor="darkgray"
        />}
      />
    </View>
  )
}

export default WalletsScreen

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  walletLegend: {
    flexDirection: 'row',
    marginLeft: '30%',
    alignItems: 'center',
  },
  walletContainer: {
    padding: 15,
    borderColor: '#AAA',
    flex: 1,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "space-between",
    alignItems: "center"
  },
  walletName: {
    fontWeight: 'bold',
    fontSize: 23,
  }
})