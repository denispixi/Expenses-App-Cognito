import React from 'react'
import { Text as RNText, TextProps } from 'react-native'
import { useTheme } from '@react-navigation/native'

type Props = {
  // style?: StyleProp<TextStyle>,
  children?: any
} & TextProps

export function Text(props: Props) {
  const { colors } = useTheme()
  return (
    <RNText {...props} style={[{ color: colors.text }, props.style]}>
      {props.children}
    </RNText>
  )
}