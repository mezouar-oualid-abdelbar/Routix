import React, { useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import TimedForm from "./type-forms/TimedForm";
import MultiActivitiesForm from "./type-forms/MultiActivitiesForm";
import FollowUpForm from "./type-forms/FollowUpForm";
import theme from "../styles/theme";

export function TypeForm({ type, switchType, setType, typeData, setTypeData }) {
  useEffect(() => {
    setTypeData(null);
  }, [type]);

  const renderTypeForm = (selectedType, data) => {
    switch (selectedType) {
      case "timed":
        return <TimedForm typeData={data} setTypeData={setTypeData} />;
      case "follow_up":
        return <FollowUpForm typeData={data} setTypeData={setTypeData} />;
      case "multi_activities":
        return (
          <MultiActivitiesForm typeData={data} setTypeData={setTypeData} />
        );
      default:
        return null;
    }
  };

  const initialTypeIndex = Math.max(
    0,
    switchType ? switchType.findIndex((item) => item.value === type) : 0,
  );

  return (
    <>
      <Text style={styles.header}>Type</Text>

      <SwitchSelector
        options={switchType}
        initial={initialTypeIndex}
        onPress={(value) => setType(value)}
        buttonColor={theme.colors.primary}
        backgroundColor={theme.colors.surface}
        textColor={theme.colors.textSecondary}
        selectedTextStyle={{ color: theme.colors.textInverse }}
        style={styles.switch}
      />

      {renderTypeForm(type, typeData)}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  switch: {
    marginBottom: theme.spacing.sm,
  },
});
