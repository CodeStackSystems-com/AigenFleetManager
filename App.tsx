// App.tsx
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home"; // Update this to match your actual file
import JiraTickets from "./screens/JiraTickets";
import {NativeModules, Button} from 'react-native';

const Stack = createStackNavigator();
const {RobotManager} = NativeModules;
const NewModuleButton = () => {
  const onPress = async () => {
    const data = await RobotManager.getRobotHeartbeat();

    console.log(`${data}`);
  };
};
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home as React.ComponentType} />
        <Stack.Screen
          name="JiraTickets"
          component={JiraTickets}
          options={{ title: "Jira Tickets" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
