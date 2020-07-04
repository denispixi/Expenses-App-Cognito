import React from 'react'
import { View, ViewStyle } from 'react-native'

type Props = {
  height?: number | string,
  width?: number | string,
  backgroundColor?: string,
  style?: ViewStyle
}

const SizedBox = ({
  height = 20,
  width = "100%",
  backgroundColor = 'transparent',
  style = {}
}: Props) => (
    <View
      style={[
        { height, width, backgroundColor },
        style
      ]}
    />
  )

export { SizedBox }