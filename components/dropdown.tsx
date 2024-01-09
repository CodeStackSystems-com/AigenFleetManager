import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Option {
  label: string;
  value: string;
}

interface MyDropdownProps {
  options: Option[];
  onChange: (itemValue: string) => void;
}

const MyDropdown: React.FC<MyDropdownProps> = ({ options, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Option | null>(null);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleSelect = (option: Option) => {
    setSelectedValue(option);
    onChange(option.value); // Call the onChange callback with the selected value
    toggleModal();
  };

  const renderItem = ({ item, index }: { item: Option; index: number }) => (
    <TouchableOpacity onPress={() => handleSelect(item)}>
      <Text style={[styles.itemLabel, index !== 0 && styles.itemBorder]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.dropdown}>
      <TouchableOpacity onPress={toggleModal}>
        <View style={styles.selectedValueContainer}>
          <Text style={styles.selectedValueText}>
            {selectedValue ? selectedValue.label : "Select option"}
          </Text>
          <Ionicons name="chevron-down" size={24} color="black" />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View style={styles.popUp}>
              <FlatList
                data={options}
                renderItem={renderItem}
                keyExtractor={(item) => item.value}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  popUp: {
    width: 250,
    backgroundColor: "#D9D9D9",
    marginBottom: 20,
    borderRadius: 8,
    padding: 10,
  },
  dropdown: {
    width: 250,
    backgroundColor: "#D9D9D9",
    marginBottom: 20,
    borderRadius: 8,
    padding: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  itemLabel: {
    fontSize: 20,
    marginBottom: 10,
    paddingTop: 10,
  },
  itemBorder: {
    borderColor: "#000",
    borderTopWidth: 1,
    fontSize: 20,
    marginBottom: 10,
    paddingTop: 20,
  },
  selectedValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedValueText: {
    fontSize: 20,
  },
});

export default MyDropdown;
