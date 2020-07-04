import React from 'react'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { Text } from './Text'
import { useTheme } from '@react-navigation/native'

type Props = {
  options: { label: string, value: any }[]
  selectedValue: any
  onChange: (theme: any) => void
}


export function RadioButton(props: Props) {
  const { colors } = useTheme()

  function selectColor(value?: boolean) {
    return value === props.selectedValue ? colors.primary : 'transparent'
  }

  const onChange = (value: any) => () => {
    props.onChange(value)
  }

  return (
    <View>
      {props.options.map((item, index) => {
        return (
          <TouchableWithoutFeedback key={index} onPress={onChange(item.value)}>
            <View style={styles.radioButtonRow}>
              <Text style={{fontSize: 15}}>{item.label}</Text>
              <MaterialIcon
                name="check"
                color={selectColor(item.value)}
                size={25} />
            </View>
          </TouchableWithoutFeedback>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  radioButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    
  }
})