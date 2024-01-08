import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Data {
  robotID: string;
  fieldID: string;
  issue: string;
  description: string;
  issueType: string;
  hwReplaced: string;
  recovered: string;
  fru: string;
}

const JiraTickets = () => {
  const [data, setData] = React.useState<Data>({
    robotID: "",
    fieldID: "",
    issue: "",
    description: "",
    issueType: "",
    hwReplaced: "",
    recovered: "",
    fru: "",
  });

  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  const keyboardAvoidingContainer = {
    marginTop: isKeyboardVisible ? -110 : 0,
  };

  const [isDataValid, setIsDataValid] = React.useState(false);

  const backgroundColor = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  React.useEffect(() => {
    // Define the colors
    const startColor = "#D9D9D9";
    const endColor = isDataValid ? "#FF8A00" : startColor;

    // Animate the background color
    Animated.timing(backgroundColor, {
      toValue: isDataValid ? 1 : 0,
      duration: 400, // Duration of the animation in milliseconds
      easing: Easing.linear,
      useNativeDriver: false, // Make sure to set useNativeDriver to false for backgroundColor animation
    }).start();
  }, [isDataValid]);

  React.useEffect(() => {
    const checkData = () => {
      // Check if all items inside data are truthy
      if (
        !data.robotID ||
        !data.fieldID ||
        !data.issue ||
        !data.description ||
        !data.issueType ||
        !data.recovered
      ) {
        return false;
      }

      if (data.issueType === "HW Issue" && data.hwReplaced === "") {
        return false;
      }

      if (data.hwReplaced === "Yes" && data.fru === "") {
        return false;
      }

      return true;
    };

    setIsDataValid(checkData());
  }, [data]);

  const handleIssueChange = (itemValue: string) => {
    if (itemValue !== "HW Issue") {
      setData({ ...data, issueType: itemValue, hwReplaced: "" });
    } else {
      setData({ ...data, issueType: itemValue });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Left Column */}

        <View style={styles.leftColumn}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={keyboardAvoidingContainer}
          ></KeyboardAvoidingView>
          <Text
            style={
              isKeyboardVisible
                ? {
                    color: "#D9D9D9",
                    fontSize: 30,
                    alignSelf: "center",
                    marginTop: 20,
                    marginBottom: -25,
                  }
                : styles.log
            }
          >
            Log an Issue
          </Text>

          {/* Container for the two columns inside the left column */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            {/* Left Column inside left column */}

            <View style={styles.leftLabels}>
              <Text style={ isKeyboardVisible ? styles.shrinkedText : styles.text}>Robot ID</Text>
              <Text style={ isKeyboardVisible ? styles.shrinkedText : styles.text}>Field ID</Text>
              <Text style={ isKeyboardVisible ? styles.shrinkedText : styles.text}>Issue</Text>
              <Text style={ isKeyboardVisible ? styles.shrinkedText : styles.text}>Description</Text>
            </View>

            {/* Right Column inside left column */}

            <View style={styles.leftInputs}>
              <TextInput
                style={isKeyboardVisible ? styles.shrinkedInput : styles.input}
                onChangeText={(text) => setData({ ...data, robotID: text })}
                value={data.robotID}
              />
              <TextInput
                style={isKeyboardVisible ? styles.shrinkedInput : styles.input}
                onChangeText={(text) => setData({ ...data, fieldID: text })}
                value={data.fieldID}
              />
              <TextInput
                style={isKeyboardVisible ? styles.shrinkedInput : styles.input}
                onChangeText={(text) => setData({ ...data, issue: text })}
                value={data.issue}
              />
              <TextInput
                style={isKeyboardVisible ? styles.shrinkedDesc : styles.descInput}
                multiline
                numberOfLines={4} // Set the number of lines you want to display
                textAlignVertical="top"
                onChangeText={(text) => setData({ ...data, description: text })}
                value={data.description}
              />
            </View>
          </View>
        </View>

        {/* Right Column */}
        <View style={styles.rightColumn}>
          {/* Container for the two columns inside the right column */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
            }}
          >
            {/* Left Column inside right column */}
            <View style={styles.rightLabels}>
              <Text style={styles.rightText}>Issue Type</Text>
              {/* If issue type is HW Issue, show hw replaced label */}
              <View>
                {data.issueType === "HW Issue" ? (
                  <Text style={styles.rightText}>HW Replaced?</Text>
                ) : null}
              </View>
              {/* If HW Replaced is yes, show FRU */}
              <View>
                {data.hwReplaced === "Yes" ? (
                  <Text style={styles.rightText}>FRU</Text>
                ) : null}
              </View>
              <Text style={styles.rightText}>Recovered?</Text>
            </View>

            {/* Right Column inside right column */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.rightInputs}>
                <Picker
                  selectedValue={data.issueType}
                  style={styles.dropdown}
                  onValueChange={(itemValue: string) =>
                    handleIssueChange(itemValue)
                  }
                >
                  <Picker.Item
                    label="Select option"
                    value="Select option"
                    style={styles.option}
                    enabled={false}
                  />
                  {/* Placeholder */}
                  <Picker.Item
                    label="Stuck/Obstacle"
                    value="Stuck/Obstacle"
                    style={styles.option}
                  />
                  <Picker.Item
                    label="HW Issue"
                    value="HW Issue"
                    style={styles.option}
                  />
                  <Picker.Item
                    label="Suspected SW"
                    value="Suspected SW"
                    style={styles.option}
                  />
                </Picker>

                {/* If issue type is HW Issue, show hw replaced picker */}

                <View>
                  {data.issueType === "HW Issue" ? (
                    <Picker
                      style={styles.dropdown}
                      selectedValue={data.hwReplaced}
                      onValueChange={(itemValue: string, itemIndex: number) => {
                        setData({ ...data, hwReplaced: itemValue });
                      }}
                    >
                      <Picker.Item
                        label="Select option"
                        value="Select option"
                        style={styles.option}
                        enabled={false}
                      />
                      <Picker.Item
                        label="Yes"
                        value="Yes"
                        style={styles.option}
                      />
                      <Picker.Item
                        label="No"
                        value="No"
                        style={styles.option}
                      />
                    </Picker>
                  ) : null}
                </View>

                {/* If HW Replaced is yes, show FRU dropdown */}
                <View>
                  {data.hwReplaced === "Yes" ? (
                    <Picker
                      style={styles.dropdown}
                      selectedValue={data.fru}
                      onValueChange={(itemValue: string) =>
                        setData({ ...data, fru: itemValue })
                      }
                    >
                      <Picker.Item
                        label="Select option"
                        value="Select option"
                        style={styles.option}
                        enabled={false}
                      />
                      <Picker.Item
                        label="Arm Assembly"
                        value="Arm Assembly"
                        style={styles.option}
                      />
                      <Picker.Item
                        label="Arm tip"
                        value="Arm tip"
                        style={styles.option}
                      />
                      <Picker.Item
                        label="Battery"
                        value="Battery"
                        style={styles.option}
                      />
                      <Picker.Item
                        label="Central enclosure"
                        value="Central enclosure"
                        style={styles.option}
                      />
                      <Picker.Item
                        label="Harness"
                        value="Harness"
                        style={styles.option}
                      />
                      <Picker.Item
                        label="Payload"
                        value="Payload"
                        style={styles.option}
                      />
                      <Picker.Item
                        label="Side assembly"
                        value="Side assembly"
                        style={styles.option}
                      />
                      <Picker.Item
                        label="Solar assembly"
                        value="Solar assembly"
                        style={styles.option}
                      />
                      <Picker.Item
                        label="Wheels with motors"
                        value="Wheels with motors"
                        style={styles.option}
                      />
                      <Picker.Item
                        label="Other"
                        value="Other"
                        style={styles.option}
                      />
                    </Picker>
                  ) : null}
                </View>

                <Picker
                  style={styles.dropdown}
                  selectedValue={data.recovered}
                  onValueChange={(itemValue: string) =>
                    setData({ ...data, recovered: itemValue })
                  }
                >
                  <Picker.Item
                    label="Select option"
                    value="Select option"
                    style={styles.option}
                    enabled={false}
                  />
                  <Picker.Item label="Yes" value="Yes" style={styles.option} />
                  <Picker.Item label="No" value="No" style={styles.option} />
                </Picker>

                <View>
                  {/* rest of the code */}

                  <Animated.View
                    style={{
                      backgroundColor: backgroundColor.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["#D9D9D9", "#FF8A00"],
                      }),
                      width: 150,
                      height: 60,
                      borderRadius: 10,
                      alignSelf: "center",
                      marginTop: 50,
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        // Handle button press
                        // This is where you can add logic to submit the form or perform other actions
                        console.log(isDataValid);
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          fontSize: 20,
                          color: "#fff",
                          textAlign: "center",
                        }}
                      >
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // This makes the container take up the entire screen
    flexDirection: "row", // Row layout for the parent container
    justifyContent: "space-between", // Space between the two columns
    paddingHorizontal: 0, // Adjust as needed
    paddingVertical: 40, // Adjust as needed
    backgroundColor: "#1E1E1E",
  },
  leftColumn: {
    flex: 1, // Each column takes up equal space
    flexDirection: "column", // Column layout for the child containers
    borderRightWidth: 3,
    borderRightColor: "#D9D9D9",
  },
  rightColumn: {
    flex: 1, // Each column takes up equal space
    flexDirection: "column", // Column layout for the child containers
  },
  text: {
    color: "#fff",
    fontSize: 25,
    paddingBottom: 30,
  },
  shrinkedText: {
    color: "#fff",
    fontSize: 25,
    paddingBottom: 15,
  },
  log: {
    color: "#D9D9D9",
    fontSize: 30,
    alignSelf: "center",
  },
  leftLabels: {
    marginTop: 40,
    marginLeft: 20,
  },
  leftInputs: {
    marginTop: 40,
    marginLeft: 20,
  },
  input: {
    height: 40,
    width: 300,
    borderWidth: 1,
    color: "#000",
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    marginBottom: 22.5,
    paddingLeft: 10,
    fontSize: 20,
  },
  shrinkedInput: {
    height: 40,
    width: 300,
    borderWidth: 1,
    color: "#000",
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 20,
  },
  descInput: {
    height: 100,
    width: 300,
    borderWidth: 1,
    color: "#000",
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    marginBottom: 22.5,
    paddingLeft: 10,
    fontSize: 20,
    paddingTop: 10,
  },
  shrinkedDesc: {
    height: 100,
    width: 300,
    borderWidth: 1,
    color: "#000",
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 20,
    paddingTop: 10,
  },
  rightLabels: {
    color: "#fff",
    fontSize: 25,
    marginLeft: 40,
    marginTop: 10,
  },
  rightInputs: {
    marginLeft: 20,
  },
  option: {
    color: "#000",
    fontSize: 20,
  },
  dropdown: {
    height: 60,
    width: 250,
    backgroundColor: "#D9D9D9",
    marginBottom: 20,
  },
  rightText: {
    color: "#fff",
    fontSize: 25,
    marginBottom: 50,
  },
});

export default JiraTickets;
