import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import theme from "../styles/theme";

class ActivitiesScreen extends Component {
  state = {};
  render() {
    return (
      <View style={styles.container}>
        <Text>activity screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // Deep dark background from palette
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ActivitiesScreen;
