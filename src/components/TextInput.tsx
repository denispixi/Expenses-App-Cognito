import React from 'react'
import { TextInput as RNTextInput, TextInputProps } from 'react-native'
import { useTheme } from '@react-navigation/native'

export function TextInput(props: TextInputProps) {
  const { dark, colors } = useTheme()
  return (
    <RNTextInput
      {...props}
      style={[props.style, { color: colors.text }]}
      keyboardAppearance={dark ? 'dark' : 'default'}
    />
  )
}