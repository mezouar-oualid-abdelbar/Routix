import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import type React from "react";

import HomeScreen from "../screens/HomeScreen";
import ActivitiesScreen from "../screens/ActivitiesScreen";
import StatusScreen from "../screens/StatusScreen";
import theme from "../styles/theme";
import CreateActivityScreen from "../screens/CreateActivityScreen";

type RootTabParamList = {
  Home: undefined;
  Activities: undefined;
  Status: undefined;
  CreateActivityScreen: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
  activeName: IconName;
  inactiveName: IconName;
}

function TabIcon({ focused, color, size, activeName, inactiveName }: TabIconProps) {
  return (
    <Ionicons
      name={focused ? activeName : inactiveName}
      size={size}
      color={color}
    />
  );
}

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              activeName="home"
              inactiveName="home-outline"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Activities"
        component={ActivitiesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              activeName="list"
              inactiveName="list-outline"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Status"
        component={StatusScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              activeName="stats-chart"
              inactiveName="stats-chart-outline"
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              activeName="settings"
              inactiveName="settings-outline"
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name="CreateActivityScreen"
        component={CreateActivityScreen}
        options={{
          tabBarItemStyle: { display: "none" },
          tabBarStyle: { display: "none" },
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
