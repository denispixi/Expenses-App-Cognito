import API from '@aws-amplify/api-rest'
import awsConfig from '../../aws-config'
const GraphQLPath = '/graphql'
const buildBody = (query: string) => ({ body: { query } })

export async function getWallets() {
  const query = `{
    getWallets {
        _id
        name
        walletType
        funds
        color
    }
  }`
  const { data: { getWallets: wallets = [] } = {} } = await API.post(
    awsConfig.API.endpoints[0].name,
    GraphQLPath,
    buildBody(query)
  )
  return wallets
}

export async function saveWallet(
  name: string,
  walletType: string,
  funds: number,
  color: string,
  _id?: string,
) {
  const query = `mutation {
    registerWallet(
      name: "${name}",
      funds: ${funds},
      walletType: "${walletType}",
      color: "${color}"
      ${_id ? `, _id: "${_id}"` : ''}
    ) {
      _id
      name
      walletType
      funds
      color
    }
  }`
  const { data: { registerWallet: wallet = null } = {} } = await API.post(
    awsConfig.API.endpoints[0].name,
    GraphQLPath,
    buildBody(query)
  )
  return wallet
}


export async function registerExpense(amount: number, comments: string, walletId: string, imgs: string[]) {
  const query = `mutation {
    registerExpense(
        amount: ${amount},
        wallet: "${walletId}",
        comments: "${comments}",
        imageUris: ${JSON.stringify(imgs)}
    ) {
        _id
        amount
        createdAt,
        wallet {
            _id
            name
            funds
            color
        }
    }
  }`
  const { data: { registerExpense: expense = null } = {} } = await API.post(
    awsConfig.API.endpoints[0].name,
    GraphQLPath,
    buildBody(query)
  )
  return expense
}

export async function getExpenses() {
  const query = `{
    getExpenses {
      _id
      amount
      imageUris
      createdAt
      wallet {
        _id
        name
        color
      }
    }
  }`
  console.log('aca esss:::', JSON.stringify(awsConfig, null, 2))
  const { data: { getExpenses: expenses = [] } = {} } = await API.post(
    awsConfig.API.endpoints[0].name,
    GraphQLPath,
    buildBody(query)
  )
  return expenses
}
