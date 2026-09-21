import React from "react";
import SwitchSelector from "react-native-switch-selector";
import theme from "../../styles/theme";

export function AppSwitch({ options = [], value, onPress, style }) {
  const initialIndex = Math.max(
    0,
    options.findIndex((item) => item.value === value),
  );

  return (
    <SwitchSelector
      options={options}
      initial={initialIndex}
      onPress={onPress}
      buttonColor={theme.colors.primary}
      backgroundColor={theme.colors.surface}
      textColor={theme.colors.textSecondary}
      selectedTextStyle={{ color: theme.colors.textInverse }}
      style={style}
    />
  );
}

export default AppSwitch;
