import hardcodedHeartbeat from "../hardcodedHeartbeat.json";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const RobotToDo = () => {
  const robotInfo = hardcodedHeartbeat;

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.errorContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.errorText}>
            {`${robotInfo.event.measure_name} ${robotInfo.event.measure_value.value}`}
          </Text>
        </View>
        <Text style={styles.errorText}>{robotInfo.event.timestamp}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  errorContainer: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#0d0d0d",
    marginBottom: 20,
    borderRadius: 10,
  },
  errorText: {
    fontSize: 20,
    color: "#D9D9D9",
  },
});

export default RobotToDo;
