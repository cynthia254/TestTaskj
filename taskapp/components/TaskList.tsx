import React, { useState } from 'react';
import { View, FlatList, Text, Button, StyleSheet, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure AsyncStorage is imported
import { Task } from '../src/text';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  navigation: any;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks, navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const statusColors: { [key: string]: string } = {
    'To Do': '#ffcccb',
    'In Progress': '#ffe4b5',
    'Completed': '#90ee90',
  };

  const deleteTask = (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            console.log("Deleting task with ID:", id);
            setTasks(prevTasks => {
              const newTasks = prevTasks.filter(task => task.id !== id);
              console.log("Updated tasks list:", newTasks);
              AsyncStorage.setItem('tasks', JSON.stringify(newTasks))
                .catch(error => {
                  console.error('Error saving tasks after deletion:', error);
                });
              return newTasks;
            });
          }
        },
      ]
    );
  };

  const filteredTasks = tasks.filter(task => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    return (
      task.name.toLowerCase().includes(lowerCaseTerm) ||
      task.dueDate.includes(lowerCaseTerm) ||
      task.status.toLowerCase().includes(lowerCaseTerm)
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Add Task"
          onPress={() => navigation.navigate('Add Task')}
        />
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, due date, or status..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.taskItem, { backgroundColor: statusColors[item.status] }]}>
            <Text style={styles.taskName}>{item.name}</Text>
            <Text>{item.dueDate}</Text>
            <Text style={styles.statusText}>{item.status}</Text>
            <View style={styles.innerButtonContainer}>
              <Button
                title="Edit"
                onPress={() => navigation.navigate('Edit Task', { task: item })}
              />
              <Button
                title="Delete"
                onPress={() => deleteTask(item.id)}
                color="#ff4d4d"
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  taskItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'column',
    borderRadius: 5,
    marginBottom: 10,
  },
  taskName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusText: {
    marginTop: 5,
    fontStyle: 'italic',
  },
  innerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default TaskList;
