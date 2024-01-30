import React from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";

interface ImageModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenCamera: () => void;
  onSelectGallery: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  visible,
  onClose,
  onOpenCamera,
  onSelectGallery,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true} // Set transparent to true
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          {/* Close Button - Upper Right Corner */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Image source={require("../assets/closeButton.png")} />
          </TouchableOpacity>
          {/* Left Section - Open Camera */}
          <TouchableOpacity style={styles.modalSection} onPress={onOpenCamera}>
            <Image source={require("../assets/cameraLogo.png")} />
            <Text style={styles.sectionText}>Take a photo</Text>
          </TouchableOpacity>

          {/* Right Section - Select from Gallery */}
          <TouchableOpacity
            style={styles.modalSection}
            onPress={onSelectGallery}
          >
            <Image source={require("../assets/gallerySelection.jpg")} />
            <Text style={styles.sectionText}>Add from Gallery</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    flexDirection: "row",
    borderRadius: 15,
    marginTop: "6%",
    height: "85%",
    width: "75%",
    backgroundColor: "white", // Added background color to the modal content
  },
  modalSection: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: "#000",
    borderWidth: 3,
    marginHorizontal: "8%",
    marginVertical: "8%",
    borderRadius: 40,
    justifyContent: "center",
  },
  sectionText: {
    marginTop: 15,
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: -20,
    right: -20,
  },
});

export default ImageModal;
