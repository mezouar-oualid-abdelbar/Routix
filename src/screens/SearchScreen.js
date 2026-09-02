import { Component } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import theme from "../styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";

class SearchScreen extends Component {
  state = {
    query: "",
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="search for your activity"
          placeholderTextColor={theme.colors.textSecondary}
          value={this.state.query}
          onChangeText={(text) => this.setState({ query: text })}
          autoFocus
        />

        <Text style={styles.placeholder}>No results yet</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  searchBar: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  placeholder: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    textAlign: "center",
    marginTop: theme.spacing.lg,
  },
});

export default SearchScreen;
