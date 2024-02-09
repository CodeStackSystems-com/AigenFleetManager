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
  ActivityIndicator,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MyDropdown from "../components/dropdown";
import { NativeModules, Image } from "react-native";
import jiraService from "../services/jiraService";
import CustomModal from "../components/popUp";
import * as ImagePicker from "expo-image-picker";
import CustomImageModal from "../components/imageModal";
import attachmentService from "../services/attachmentToJiraIssue";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation";
import { Data } from "../types/data";

type JiraTicketsRouteProp = RouteProp<RootStackParamList, "JiraTickets">;

interface Props {
  route: JiraTicketsRouteProp;
}

const JiraTickets: React.FC<Props> = ({ route }) => {
  const formData: Data = route.params.formData;

  const [data, setData] = React.useState<Data>({
    robotID: formData.robotID || "",
    fieldID: formData.fieldID || "",
    issue: formData.issue || "",
    description: formData.description || "",
    issueType: "",
    hwReplaced: "",
    recovered: "",
    fru: "",
    images: formData.images || [],
  });

  // UseEffect hook to update state when props change
  React.useEffect(() => {
    setData({
      ...data,
      robotID: formData.robotID || "",
      fieldID: formData.fieldID || "",
      issue: formData.issue || "",
      description: formData.description || "",
      images: formData.images || [],
    });
  }, [formData]);

  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);
  const [isDataValid, setIsDataValid] = React.useState(false);
  const [errorModalVisible, setErrorModalVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successModalVisible, setSuccessModalVisible] = React.useState(false);
  const [dropdownKey, setDropdownKey] = React.useState(0);
  const [imageModalVisible, setImageModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (successModalVisible) {
      // Increment the dropdownKey to trigger a re-render of dropdowns
      setDropdownKey((prevKey) => prevKey + 1);
    }
  }, [successModalVisible]);

  const keyboardAvoidingContainer = {
    marginTop: isKeyboardVisible ? -110 : 0,
  };

  const backgroundColor = React.useRef(new Animated.Value(0)).current;

  const openImageModal = () => {
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
  };

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

  const handleJiraIssueCreation = async (data: Data) => {
    try {
      // Check if data is valid
      if (!isDataValid) {
        setErrorMessage("Please fill out all fields before continuing.");
        setErrorModalVisible(true);
        return;
      }

      //Change loading state to true, this is for the loading spinner
      setLoading(true);

      // Attempt to create Jira issue
      const result = await jiraService.createJiraIssue(data);

      if (result.success) {
        // The API call was successful, you can perform any additional actions here if needed.
        // For example, you can display a success message to the user.

        // If there is an image, call the other service to attach it to the issue
        if (data.images && data.images.length > 0) {
          for (let i = 0; i < data.images.length; i++) {
            const attachmentResult =
              await attachmentService.attachImageToJiraIssue(
                data.images[i],
                result.issueKey
              );

            if (attachmentResult?.success === false) {
              setErrorMessage(
                `Failed to attach image to ticket, something went wrong.`
              );
              setErrorModalVisible(true);
            }
          }
        }

        //set loading state to false, this is for the loading spinner
        setLoading(false);

        setSuccessModalVisible(true);
        // Clear the form data after successful submission if needed
        setData({
          robotID: "",
          fieldID: "",
          issue: "",
          description: "",
          issueType: "",
          hwReplaced: "",
          recovered: "",
          fru: "",
          images: [],
        });
      } else {
        //set loading state to false, this is for the loading spinner
        setLoading(false);

        // The API call failed, display an error message
        setErrorMessage(`Failed to create ticket, something went wrong.`);
        setErrorModalVisible(true);
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected Error:", error);
      setErrorMessage("An unexpected error occurred.");
      setErrorModalVisible(true);
    }
  };

  const handleCloseErrorModal = () => {
    setErrorModalVisible(false);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  const handleIssueChange = (itemValue: string) => {
    if (itemValue !== "HW Issue") {
      setData({ ...data, issueType: itemValue, hwReplaced: "", fru: "" });
    } else {
      setData({ ...data, issueType: itemValue });
    }
  };

  const handleHwReplacedChange = (itemValue: string) => {
    if (itemValue !== "Yes") {
      setData({ ...data, hwReplaced: itemValue, fru: "" });
    } else {
      setData({ ...data, hwReplaced: itemValue });
    }
  };

  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ base64: true });

    if (data.images && result.assets && result.assets.length > 0) {
      data.images.push(result.assets[0].base64 as string);
      closeImageModal();
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      base64: true,
    });

    if (data.images && result.assets && result.assets.length > 0) {
      data.images.push(result.assets[0].base64 as string);
      closeImageModal();
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
              <Text
                style={isKeyboardVisible ? styles.shrinkedText : styles.text}
              >
                Robot ID
              </Text>
              <Text
                style={isKeyboardVisible ? styles.shrinkedText : styles.text}
              >
                Field ID
              </Text>
              <Text
                style={isKeyboardVisible ? styles.shrinkedText : styles.text}
              >
                Issue
              </Text>
              <Text
                style={isKeyboardVisible ? styles.shrinkedText : styles.text}
              >
                Description
              </Text>
              <Text style={styles.imageText}>
                {data.images?.length ?? 0 > 1 ? "Images" : "Image"}
              </Text>
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
                style={
                  isKeyboardVisible ? styles.shrinkedDesc : styles.descInput
                }
                multiline
                numberOfLines={4} // Set the number of lines you want to display
                textAlignVertical="top"
                onChangeText={(text) => setData({ ...data, description: text })}
                value={data.description}
              />

              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 200,
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity onPress={openImageModal}>
                  <Image
                    source={require("../assets/imageLogo.png")}
                    style={{ width: 50, height: 50, marginRight: 10 }}
                  />
                </TouchableOpacity>
                {data.images && (
                  <View>
                    <Text style={{ fontSize: 15, color: "#fff" }}>
                      {data.images.length === 1 && "1 image selected"}
                      {data.images.length > 1 &&
                        `${data.images.length} images selected`}
                    </Text>
                  </View>
                )}
              </View>
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
              <View key={dropdownKey} style={styles.rightInputs}>
                <MyDropdown
                  options={[
                    { label: "Stuck/Obstacle", value: "Stuck/Obstacle" },
                    { label: "HW Issue", value: "HW Issue" },
                    { label: "Suspect SW", value: "Suspect SW" },
                  ]}
                  onChange={handleIssueChange}
                />

                {/* If issue type is HW Issue, show hw replaced picker */}

                <View>
                  {data.issueType === "HW Issue" ? (
                    <MyDropdown
                      options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                      ]}
                      onChange={handleHwReplacedChange}
                    />
                  ) : null}
                </View>

                {/* If HW Replaced is yes, show FRU dropdown */}
                <View>
                  {data.hwReplaced === "Yes" ? (
                    <MyDropdown
                      options={[
                        { label: "Arm Assembly", value: "Arm Assembly" },
                        { label: "Arm tip", value: "Arm tip" },
                        { label: "Battery", value: "Battery" },
                        {
                          label: "Central enclosure",
                          value: "Central enclosure",
                        },
                        { label: "Harness", value: "Harness" },
                        { label: "Payload", value: "Payload" },
                        { label: "Side assembly", value: "Side assembly" },
                        { label: "Solar assembly", value: "Solar assembly" },
                        {
                          label: "Wheels with motors",
                          value: "Wheels with motors",
                        },
                        { label: "Other", value: "Other" },
                      ]}
                      onChange={(itemValue) =>
                        setData({ ...data, fru: itemValue })
                      }
                    />
                  ) : null}
                </View>

                <MyDropdown
                  options={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                  onChange={(itemValue) =>
                    setData({ ...data, recovered: itemValue })
                  }
                />

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
                        if (
                          !loading &&
                          successModalVisible === false &&
                          errorModalVisible === false
                        ) {
                          handleJiraIssueCreation(data);
                        }
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

                  {/* Error Modal */}
                  <CustomModal
                    isVisible={errorModalVisible}
                    onClose={handleCloseErrorModal}
                    message={errorMessage}
                  />
                  {/* Success Modal */}
                  <CustomModal
                    isVisible={successModalVisible}
                    onClose={handleCloseSuccessModal}
                    message="Ticket has been submitted successfully."
                  />
                  <CustomImageModal
                    visible={imageModalVisible}
                    onClose={closeImageModal}
                    onSelectGallery={pickImage}
                    onOpenCamera={openCamera}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={125} color="#FF8A00" />
            <Text style={{ marginTop: 10, color: "#FFF", fontSize: 40 }}>
              Loading...
            </Text>
          </View>
        )}
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
  imageText: {
    color: "#fff",
    fontSize: 25,
    paddingTop: 70,
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
    width: 250,
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
    width: 250,
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
    width: 250,
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
    width: 250,
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
    marginBottom: 30,
  },
  errorModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  errorModalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeModalText: {
    fontSize: 16,
    color: "#007BFF",
  },
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -105,
    marginTop: -70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#D9D9D9",
  },
});

export default JiraTickets;
