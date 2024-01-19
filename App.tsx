// App.tsx
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home"; // Update this to match your actual file
import JiraTickets from "./screens/JiraTickets";
import { NativeModules, Button } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();
const { RobotManager } = NativeModules;
const NewModuleButton = () => {
  const onPress = async () => {
    const data = await RobotManager.getRobotHeartbeat();

    console.log(`${data}`);
  };
};
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home as React.ComponentType}
            options={{ orientation: "landscape" }}
          />
          <Stack.Screen
            name="JiraTickets"
            component={JiraTickets}
            options={{ title: "Jira Tickets", orientation: "landscape" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
