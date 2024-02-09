import React from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  NativeModules,
} from "react-native";
import FirstJiraColumn from "../components/FirstJiraColumn";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";
import jiraIssuesService from "../services/getJQLService";
import JiraIssues from "../components/jiraIssues";
import RobotToDo from "../components/robotToDo";

const InitialJiraView = () => {
  const [selectedItem, setSelectedItem] = React.useState<string>("To Do");
  const [heartbeatSuccess, setHeartbeatSuccess] =
    React.useState<boolean>(false);
  const [jiraIssues, setJiraIssues] = React.useState<
    { status: string; summary: string }[]
  >([]);
  const underlineWidth = React.useRef(new Animated.Value(0)).current;

  const getIssues = async () => {
    const response = await jiraIssuesService.getJiraIssues();

    if (response) {
      setJiraIssues(response);
    } else {
      setJiraIssues([]);
    }
  };

  React.useEffect(() => {
    getIssues();
  }, []);

  const { RobotManager } = NativeModules;

  const getRobotInfo = async () => {
    const robotInfoString = await RobotManager.getRobotHeartbeat();
    if (robotInfoString) {
      const robotInfoFormat = robotInfoString.replace("/robot/heartbeat:", "");
      const robotInfo = JSON.parse(robotInfoFormat);

      setHeartbeatSuccess(true);
    } else {
      setHeartbeatSuccess(false);
    }
  };

  React.useEffect(() => {
    getRobotInfo();
  }, []);

  const handleItemPress = (item: string) => {
    setSelectedItem(item);
    underlineWidth.setValue(0); // Resetting the underline width
    animateUnderline();
  };

  React.useEffect(() => {
    animateUnderline(); // Trigger animation when selectedItem changes
  }, [selectedItem]);

  const animateUnderline = () => {
    Animated.timing(underlineWidth, {
      toValue: 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "JiraTickets">>();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          {/* Content for the left column */}
          <TouchableOpacity
            style={{
              position: "absolute",
              zIndex: 99,
              top: -30,
              left: 10,
            }}
            onPress={() => navigation.navigate("Home")}
          >
            <Image
              style={{
                width: 50,
                height: 50,
              }}
              source={require("../assets/closeButtonWhite.png")}
            />
          </TouchableOpacity>
          <Text style={styles.errorLog}>Error/Issues Log</Text>
          <View style={styles.optionsContainer}>
            {["To Do", "JSM Tickets"].map((item, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.itemContainer}>
                  <Text
                    style={[
                      styles.text,
                      selectedItem === item && styles.selectedText,
                    ]}
                  >
                    {item}
                  </Text>
                  {selectedItem === item && (
                    <Animated.View
                      style={[
                        styles.underline,
                        {
                          width: underlineWidth,
                        },
                      ]}
                    />
                  )}
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
          {selectedItem === "To Do" && <RobotToDo />}
          {selectedItem === "JSM Tickets" && <JiraIssues issues={jiraIssues} />}
        </View>

        <View style={styles.rightColumn}>
          {/* Content for the right column */}
          <FirstJiraColumn navigation={navigation} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
  },
  leftColumn: {
    flex: 1,
    borderRightWidth: 3,
    borderColor: "#D9D9D9",
    marginVertical: 40,
  },
  rightColumn: {
    flex: 1,
  },
  errorLog: {
    color: "#D9D9D9",
    fontSize: 30,
    textAlign: "center",
    marginTop: -10,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 30,
  },
  itemContainer: {
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#D9D9D9",
    fontWeight: "bold",
    paddingBottom: 10,
  },
  selectedText: {
    color: "#D9D9D9",
    fontWeight: "bold",
  },
  underline: {
    position: "absolute",
    bottom: 0, // Adjust as needed
    height: 2,
    backgroundColor: "#D9D9D9",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollText: {
    fontSize: 20,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default InitialJiraView;
