import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  PanResponder,
} from 'react-native';
import { Todo } from '../../types';
import { format } from 'date-fns';
import { Color } from '../theme';
import AntDesign from "@expo/vector-icons/AntDesign";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

interface DateItem {
  type: 'date';
  data: string;
}

interface TodoItem {
  type: 'todo';
  data: Todo;
}

type ListItem = DateItem | TodoItem;

const TodoItemComponent = ({
  todo,
  onToggle,
  onDelete,
  expandedId,
  setExpandedId,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}) => {
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 5,
    onPanResponderMove: (_, gesture) => {
      if (gesture.dx < 0) {
        pan.setValue(gesture.dx);
      }
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -80) {
        Animated.spring(pan, {
          toValue: -80,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const handleDelete = () => {
    Animated.timing(pan, {
      toValue: -500,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      onDelete(todo.id);
    });
  };

  return (
    <View style={styles.todoWrapper}>
      {/* Delete button */}
      <View style={styles.deleteButtonContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <AntDesign name="delete" size={30} color={Color.white} />
        </TouchableOpacity>
      </View>

      {/* Todo item */}
      <Animated.View
        style={[
          styles.todoItem,
          { transform: [{ translateX: pan }] },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.todoContent}
          onPress={() => setExpandedId(expandedId === todo.id ? null : todo.id)}
        >
          <TouchableOpacity
            style={[styles.checkbox, todo.completed && styles.checkboxChecked]}
            onPress={() => onToggle(todo.id)}
          >
            {todo.completed && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <View style={styles.todoText}>
            <Text style={[styles.todoTitle, todo.completed && styles.completedText]}>
              {todo.title}
            </Text>
            {expandedId === todo.id && todo.description && (
              <Text style={styles.description}>{todo.description}</Text>
            )}
            <View style={styles.priorityContainer}>
              {[...Array(getPriorityLevel(todo.priority))].map((_, i) => (
                <Text key={i} style={styles.priorityIndicator}>
                  !
                </Text>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};


export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const groupedTodos = useMemo(() => {
    return todos.reduce((acc, todo) => {
      const date = format(todo.date, 'yyyy-MM-dd');
      if (!acc[date]) acc[date] = [];
      acc[date].push(todo);
      return acc;
    }, {} as Record<string, Todo[]>);
  }, [todos]);

  const listData = useMemo(() => {
    return Object.entries(groupedTodos).flatMap(([date, todos]) => [
      { type: 'date', data: date } as DateItem,
      ...todos.map(todo => ({ type: 'todo', data: todo } as TodoItem)),
    ]);
  }, [groupedTodos]);

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'date') {
      return <Text style={styles.dateHeader}>{format(new Date(item.data), 'dd MMM yyyy')}</Text>;
    }

    return (
      <TodoItemComponent
        todo={item.data}
        onToggle={onToggle}
        onDelete={onDelete}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
      />
    );
  };

  return todos.length ? (
    <FlatList
      data={listData}
      renderItem={renderItem}
      keyExtractor={(item, index) => (item.type === 'date' ? `date-${item.data}` : `todo-${item.data.id}-${index}`)}
      style={styles.container}
    />
  ) : (
    <Text style={styles.emptyMessage}>No todos available</Text>
  );
}

const getPriorityLevel = (priority: Todo['priority']): number => {
  switch (priority) {
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
      return 1;
    default:
      return 0;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: Color.dateColor,
  },
  // todoItem: {
  //   backgroundColor: Color.cancelButton,
  //   borderRadius: 10,
  //   marginBottom: 10,
  //   shadowColor: Color.black,
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 2,
  //   elevation: 2,
  // },
  todoContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Color.blue,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Color.blue,
  },
  checkmark: {
    color: Color.white,
    fontSize: 14,
  },
  todoText: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Color.message,
  },
  description: {
    marginTop: 5,
    color: Color.dateColor,
    fontSize: 14,
  },
  priorityContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  priorityIndicator: {
    color: 'orange',
    marginRight: 2,
    fontSize:20,
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Color.message,
  },
  todoWrapper: {
    position: "relative",
    marginBottom: 10,
    overflow: "hidden",
  },
  deleteButtonContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80, 
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.errorRed,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,

  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  todoItem: {
    backgroundColor: Color.cancelButton,
    borderRadius: 10,
    shadowColor: Color.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
});
