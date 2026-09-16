import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen"; 
import BottomTabNavigator from "./BottomTabNavigator";
import SearchScreen from "../screens/SearchScreen";
import TimedActivityScreen from "../screens/TimedActivityScreen";
import FollowUpActivityScreen from "../screens/FollowUpActivityScreen";
import MultiActivityScreen from "../screens/MultiActivityScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="MultiActivityScreen" component={MultiActivityScreen} />
      <Stack.Screen name="TimedActivityScreen" component={TimedActivityScreen} />
      <Stack.Screen name="FollowUpActivityScreen" component={FollowUpActivityScreen} />
      
    </Stack.Navigator>
  );
}