import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ActivitiesScreen from "../screens/ActivitiesScreen";
import StatusScreen from "../screens/StatusScreen";
import PluginsScreen from "../screens/PluginsScreen";
import theme from "../styles/theme";
import CreateActivityScreen from "../screens/CreateActivityScreen";

const Tab = createBottomTabNavigator();

function TabIcon({ focused, color, size, activeName, inactiveName }) {
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
      <Tab.Screen
        name="plugins"
        component={PluginsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              activeName="extension-puzzle"
              inactiveName="extension-puzzle-outline"
            />
          ),
        }}
      />
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