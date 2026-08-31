import React, { Component } from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";

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
    backgroundColor: "#1E2824", // Deep dark background from palette
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  glowEffect: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#42F241", // Bright neon green glow
    opacity: 0.25,
    shadowColor: "#42F241",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 15,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  accentText: {
    color: "#42F241", // Highlights the last two letters in neon green
  },
});

export default SplashScreen;
