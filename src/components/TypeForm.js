import React, { useEffect, useRef } from "react";
import { Text, StyleSheet } from "react-native";
import TimedForm from "./type-forms/TimedForm";
import MultiActivitiesForm from "./type-forms/MultiActivitiesForm";
import FollowUpForm from "./type-forms/FollowUpForm";
import theme from "../styles/theme";
import { AppSwitch } from "./common/AppSwitch";

export function TypeForm({ type, switchType, setType, typeData, setTypeData }) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the initial mount so prefilled data (edit flow) is preserved;
    // only clear when the user actually switches the type.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
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

  return (
    <>
      <Text style={styles.header}>Type</Text>

      <AppSwitch
        options={switchType}
        value={type}
        onPress={(value) => setType(value)}
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
