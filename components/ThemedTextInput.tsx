import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  isFocused?: boolean;
  type?: 'default' | 'underline' | 'rounded' | 'bordered';
};

export function ThemedTextInput({
                                  style,
                                  lightColor,
                                  darkColor,
                                  isFocused,
                                  type = 'default',
                                  ...rest
                                }: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'inputBorder');

  return (
    <TextInput
      style={[
        { color, backgroundColor, borderColor },
        {flex: 1},
        type === 'default' ? styles.default : undefined,
        type === 'underline' ? styles.underline : undefined,
        type === 'rounded' ? styles.rounded : undefined,
        type === 'bordered' ? styles.bordered : undefined,
        style,
      ]}
      placeholderTextColor={borderColor}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    padding: 10,
    borderColor: 'transparent',
    borderRadius: 5,
  },
  underline: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  rounded: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderRadius: 25,
  },
  bordered: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
