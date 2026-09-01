import React, { Component } from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import theme from "../styles/theme";

class SplashScreen extends Component {
  state = {};

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.replace("Home");
    }, 3000); // Reduced timeout to 3s for better user experience
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1E2824" />

        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>
          Rout<Text style={styles.accentText}>ix</Text>
        </Text>
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
  logoWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: theme.colors.text,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  accentText: {
    color: theme.colors.primary, // Highlights the last two letters in neon green
  },
});

export default SplashScreen;
