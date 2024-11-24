import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import TodoList from "@/src/components/TodoList";
import AddTodoModal from "@/src/components/AddTodoModal";
import { Todo } from "../../types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Color } from "../theme";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const addTodo = (todo: Todo) => {
    setTodos([...todos, todo]);
    setModalVisible(false);
  };
  console.log(todos);

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>ToDos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="create-outline" color="#007AFF" size={30} />
        </TouchableOpacity>
      </View>

      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />

      <AddTodoModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addTodo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  addButton: {
    padding: 8,
  },
  addButtonText: {
    fontSize: 45,
    color: Color.blue,
  },
});
