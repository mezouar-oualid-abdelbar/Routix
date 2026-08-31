import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

class HomeScreen extends Component {
  state = {};
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello to home screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2824", // Deep dark background from palette
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
