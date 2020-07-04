import { Theme } from "@react-navigation/native/lib/typescript/src/types";

export enum Colors {
  Facebook = '#385898',
  Google = '#ea4435',
  DarkGray = '#444'
}

export enum Themes {
  LIGTH = 'LIGTH',
  DARK = 'DARK',
  SYSTEM = 'SYSTEM',
}

export enum WalletTypes {
  TARJETA_DE_CREDITO = 'Tarjeta de crédito',
  CUENTA_DE_AHORROS = 'Cuenta de ahorros',
  EFECTIVO = 'Efectivo',
}

export const CustomLightTheme: Theme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
  },
}

export const CustomDarkTheme: Theme = {
  dark: true,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(1, 1, 1)',
    card: 'rgb(18, 18, 18)',
    text: 'rgb(229, 229, 231)',
    border: 'rgb(39, 39, 41)',
  },
}