import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Todo, Priority } from "../../types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Color } from "../theme";

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (todo: Todo) => void;
}

export default function AddTodoModal({
  visible,
  onClose,
  onAdd,
}: AddTodoModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [priority, setPriority] = useState<Priority>("medium");

  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    onAdd({
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      date,
      priority,
      completed: false,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate(new Date());
    setPriority("medium");
    setError("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <KeyboardAwareScrollView style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add new ToDo</Text>
            <TouchableOpacity onPress={handleAdd}>
              <Text style={{ ...styles.buttonText, fontWeight: "700" }}>
                Add
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder="Enter a title"
            placeholderTextColor={Color.placeHolderColor}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setError("");
            }}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter a description (optional)"
            placeholderTextColor={Color.placeHolderColor}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Pick a date</Text>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              themeVariant="light"
              onChange={(_, selectedDate) => setDate(selectedDate || date)}
            />
          </View>

          <View style={styles.priorityContainer}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityButtons}>
              {(["low", "medium", "high"] as Priority[]).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    priority === p && styles.priorityButtonSelected,
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      priority === p && styles.priorityButtonTextSelected,
                    ]}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 50,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: Color.borderColor,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: Color.errorRed,
  },
  errorText: {
    color: Color.errorRed,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
    marginTop: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  priorityContainer: {
    marginVertical: 15,
  },
  priorityButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Color.borderColor,
    marginHorizontal: 4,
    alignItems: "center",
  },
  priorityButtonSelected: {
    backgroundColor: Color.blue,
    borderColor: Color.blue,
  },
  priorityButtonText: {
    color: Color.placeHolderColor,
  },
  priorityButtonTextSelected: {
    color: Color.white,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: Color.blue,
  },
});
