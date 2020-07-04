import React from 'react'
import { View, ViewStyle } from 'react-native'

type Props = {
  style?: ViewStyle | ViewStyle[],
  children: (JSX.Element | null)[] | JSX.Element | null,
}

export const Row = (props: Props) => (
  <View style={[{ flexDirection: 'row' }, props.style]}>
    {props.children}
  </View>
);