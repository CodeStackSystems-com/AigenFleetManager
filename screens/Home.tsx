import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const navigation = useNavigation();

  const goToJiraTickets = () => {
    navigation.navigate("JiraTickets" as never);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home</Text>
      <Button title="Go to Jira Tickets" onPress={goToJiraTickets} />
    </View>
  );
};

export default Home;
