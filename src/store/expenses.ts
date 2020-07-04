import { Action, action } from 'easy-peasy'

export type Expense = {
  _id: string
  amount: number
  createdAt: string
  imgUris: string[]
  wallet: {
    name: string
    color: string
  }
}

export interface ExpenseStoreModel {
  expenses: Expense[]
  cacheLimit: Date | null
  setExpenses: Action<ExpenseStoreModel, Expense[]>
  setExpense: Action<ExpenseStoreModel, Expense>
  addExpense: Action<ExpenseStoreModel, Expense>,
  reset: Action<ExpenseStoreModel>
}


export const ExpenseStore: ExpenseStoreModel = {
  expenses: [],
  cacheLimit: null,
  setExpenses: action((state, expenses) => {
    state.expenses = expenses
    const cacheLimit = new Date()
    cacheLimit.setHours(cacheLimit.getHours() + 1)
    state.cacheLimit = cacheLimit
  }),
  addExpense: action((state, expense) => {
    state.expenses = [...state.expenses, expense]
  }),
  setExpense: action((state, expense) => {
    const indexToChange = state.expenses.findIndex(ex => ex._id === expense._id)
    if (indexToChange >= 0) {
      state.expenses[indexToChange] = expense
    }
  }),
  reset: action(state => {
    state.cacheLimit = null
    state.expenses = []
  })
}