import {
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Text,
  Image,
  Keyboard,
  NativeModules,
} from "react-native";
import React from "react";
import CustomImageModal from "../components/imageModal";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { Data } from "../types/data";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "JiraTickets">;
};

const FirstJiraColumn: React.FC<Props> = ({ navigation }) => {
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);
  const [imageModalVisible, setImageModalVisible] = React.useState(false);

  const { RobotManager } = NativeModules;

  const getRobotInfo = async () => {
    const robotInfoString = await RobotManager.getRobotHeartbeat();
    if (robotInfoString) {
      const robotInfoFormat = robotInfoString.replace("/robot/heartbeat:", "");
      const robotInfo = JSON.parse(robotInfoFormat);

      setFormData((state) => ({
        ...state,
        robotID: robotInfo.id,
        fieldID: robotInfo.name,
      }));
    }
    console.log(robotInfoString);
  };

  React.useEffect(() => {
    getRobotInfo();
  }, []);

  const goToJiraTickets = () => {
    navigation.navigate("JiraTickets", { formData: formData });
  };

  const [formData, setFormData] = React.useState<Data>({
    robotID: "",
    fieldID: "",
    issue: "",
    description: "",
    images: [],
  });

  const openImageModal = () => {
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      base64: true,
    });

    if (formData.images && result.assets && result.assets.length > 0) {
      formData.images.push(result.assets[0].base64 as string);
      closeImageModal();
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

    if (formData.images && result.assets && result.assets.length > 0) {
      formData.images.push(result.assets[0].base64 as string);
      closeImageModal();
    }
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

  const keyboardAvoidingContainer = {
    marginTop: isKeyboardVisible ? -72 : 0,
  };

  return (
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
      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      >
        {/* Left Column inside left column */}

        <View style={styles.leftLabels}>
          <Text style={isKeyboardVisible ? styles.shrinkedText : styles.text}>
            Robot ID
          </Text>
          <Text style={isKeyboardVisible ? styles.shrinkedText : styles.text}>
            Field ID
          </Text>
          <Text style={isKeyboardVisible ? styles.shrinkedText : styles.text}>
            Issue
          </Text>
          <Text style={isKeyboardVisible ? styles.shrinkedText : styles.text}>
            Description
          </Text>
          <Text style={styles.imageText}>
            {formData.images?.length ?? 0 > 1 ? "Images" : "Image"}
          </Text>
        </View>

        {/* Right Column inside left column */}

        <View style={styles.leftInputs}>
          <TextInput
            style={isKeyboardVisible ? styles.shrinkedInput : styles.input}
            onChangeText={(text) => setFormData({ ...formData, robotID: text })}
            value={formData.robotID}
          />
          <TextInput
            style={isKeyboardVisible ? styles.shrinkedInput : styles.input}
            onChangeText={(text) => setFormData({ ...formData, fieldID: text })}
            value={formData.fieldID}
          />
          <TextInput
            style={isKeyboardVisible ? styles.shrinkedInput : styles.input}
            onChangeText={(text) => setFormData({ ...formData, issue: text })}
            value={formData.issue}
          />
          <TextInput
            style={isKeyboardVisible ? styles.shrinkedDesc : styles.descInput}
            multiline
            numberOfLines={4} // Set the number of lines you want to display
            textAlignVertical="top"
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            value={formData.description}
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
                style={
                  isKeyboardVisible
                    ? styles.movedImageButton
                    : styles.defaultImageButton
                }
              />
            </TouchableOpacity>
            {formData.images && (
              <View>
                <Text
                  style={{ fontSize: 15, color: "#fff", paddingBottom: 80 }}
                >
                  {formData.images.length === 1 && "1 image selected"}
                  {formData.images.length > 1 &&
                    `${formData.images.length} images selected`}
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={goToJiraTickets}
              style={{
                backgroundColor: "#D9D9D9",
                width: 150,
                height: 50,
                borderRadius: 10,
                left: 97,
                top: 60,
                position: "absolute",
              }}
            >
              <Text
                style={{
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  fontSize: 20,
                  color: "#000",
                  textAlign: "center",
                  paddingTop: 10,
                }}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <CustomImageModal
        visible={imageModalVisible}
        onClose={closeImageModal}
        onSelectGallery={pickImage}
        onOpenCamera={openCamera}
      />
    </View>
  );
};

export default FirstJiraColumn;

const styles = StyleSheet.create({
  leftColumn: {
    flex: 1, // Each column takes up equal space
    flexDirection: "column", // Column layout for the child containers
  },
  log: {
    color: "#D9D9D9",
    fontSize: 30,
    alignSelf: "center",
    marginLeft: 150,
    paddingTop: 20,
  },
  leftLabels: {
    marginTop: 40,
    marginLeft: 80,
  },
  shrinkedText: {
    color: "#fff",
    fontSize: 25,
    paddingBottom: 15,
  },
  text: {
    color: "#fff",
    fontSize: 25,
    paddingBottom: 30,
  },
  imageText: {
    color: "#fff",
    fontSize: 25,
    paddingTop: 60,
  },
  leftInputs: {
    marginTop: 40,
    marginLeft: 20,
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
  defaultImageButton: {
    width: 50,
    height: 50,
    marginRight: 10,
    top: -40,
  },
  movedImageButton: {
    display: "none",
  },
});
