import { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import theme from "../styles/theme";

class ActivityCard extends Component {
  render() {
    const { activity } = this.props;
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.time}>{activity.time}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
  },
  time: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});

export default ActivityCard;
