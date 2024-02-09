// navigation.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./screens/Home";
import JiraTickets from "./screens/JiraTickets";
import InitialJiraView from "./screens/InitialJiraView";

interface Data {
  robotID?: string;
  fieldID?: string;
  issue?: string;
  description?: string;
  images?: string[];
}
// Define the type for the route parameters
export type RootStackParamList = {
  Home: undefined;
  JiraTickets: { formData: Data }; // Define the type of formData parameter
  InitialJiraView: undefined;
};

// Create a Stack Navigator using RootStackParamList
const Stack = createNativeStackNavigator<RootStackParamList>();

// Create a function to export the navigation container
export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ orientation: "landscape" }}
        />
        <Stack.Screen
          name="JiraTickets"
          component={JiraTickets}
          options={{ title: "Jira Tickets", orientation: "landscape" }}
        />
        <Stack.Screen
          name="InitialJiraView"
          component={InitialJiraView}
          options={{ title: "Initial Jira View", orientation: "landscape" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
