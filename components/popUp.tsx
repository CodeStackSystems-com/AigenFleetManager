import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  onClose,
  message,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.errorModalText}>{message}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    marginTop: 55,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 80,
    borderRadius: 10,
    alignItems: "center",
  },
  errorModalText: {
    fontSize: 30,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#2F2E2E",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 25,
    color: "#D9D9D9",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default CustomModal;
