import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, View, ActivityIndicator, RefreshControl, FlatList } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { SizedBox, Row, Text } from '../../../components'
import * as Services from '../../../services'
import { useStoreActions, useStoreState } from '../../../store'
import { Expense } from '../../../store/expenses'
import moment from 'moment'

function ExpenseListScreen() {
  // LOCAL STATE
  const [loading, setLoading] = useState(false)
  // APP STATE
  const { cacheLimit, expenses } = useStoreState(store => store.Expense)
  const { setExpenses } = useStoreActions(store => store.Expense)
  const { colors } = useTheme()

  useEffect(() => {
    const getExpenses = async () => {
      if (!cacheLimit || cacheLimit < new Date()) {
        setLoading(true)
        console.log('llega')
        const expenses = await Services.getExpenses()
        console.log({ expenses })
        setExpenses(expenses)
        setLoading(false)
      }
    }
    getExpenses()
  }, [])

  const getBorderTopWidth = useCallback(function (index: number) {
    return { borderTopWidth: index === 0 ? 0 : StyleSheet.hairlineWidth }
  }, [])

  function renderExpenseItem({ item: expense, index }: { item: Expense, index: number }) {
    return (
      <Row style={[styles.expenseItemContainer, getBorderTopWidth(index)]}>
        <View style={{}}>
          <Text style={styles.expenseAmount}>
            S/ {expense.amount.toFixed(2)}
          </Text>
          <SizedBox height={10} />
          <Text style={[styles.expenseAmountWallet, { color: expense.wallet.color }]}>
            {expense.wallet.name}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 16 }}>
            {moment(expense.createdAt).format('DD/MM/YYYY')}
          </Text>
          <SizedBox height={10} />
          <Text style={{ textAlign: 'center' }}>
            {moment(expense.createdAt).format('hh:mm A')}
          </Text>
        </View>
      </Row>
    )
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={({ _id }) => _id}
        renderItem={renderExpenseItem}
      // refreshControl={<RefreshControl
      //   onRefresh={refreshWallets}
      //   refreshing={refreshing}
      //   size={30}
      //   tintColor="darkgray"
      // />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    // padding: 10
  },
  expenseItemContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#AAA',
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  expenseAmountWallet: {
    fontSize: 17,
    fontWeight: 'bold',
  }
})


export default ExpenseListScreen