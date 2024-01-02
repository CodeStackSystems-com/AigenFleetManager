// App.tsx
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home"; // Update this to match your actual file
import JiraTickets from "./screens/JiraTickets";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home as React.ComponentType} />
        <Stack.Screen name="JiraTickets" component={JiraTickets} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
