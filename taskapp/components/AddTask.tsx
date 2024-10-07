import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Task } from '../src/text'; // Adjust this based on your folder structure
import { Picker } from '@react-native-picker/picker'; // Make sure to import from the correct package

interface AddTaskProps {
  saveTask: (newTask: Task) => void;
  navigation: any; // Use a more specific type if available
}

const AddTask: React.FC<AddTaskProps> = ({ saveTask, navigation }) => {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'To Do' | 'In Progress' | 'Completed'>('To Do');

  const isValidDate = (dateString: string): boolean => {
    const today = new Date();
    const inputDate = new Date(dateString);
    return inputDate > today && !isNaN(inputDate.getTime());
  };

  const handleAddTask = () => {
    if (!name) {
      alert('Task name cannot be empty.');
      return;
    }
    if (!dueDate || !isValidDate(dueDate)) {
      alert('Please enter a valid future date in YYYY-MM-DD format.');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      name,
      dueDate,
      status,
    };

    saveTask(newTask); // Pass the new task to the saveTask function
    // Reset fields after saving
    setName('');
    setDueDate('');
    setStatus('To Do');
    navigation.goBack(); // Navigate back to Task List
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Task Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Due Date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
      />
      <Picker
        selectedValue={status}
        style={styles.picker}
        onValueChange={(itemValue) => setStatus(itemValue)}
      >
        <Picker.Item label="To Do" value="To Do" />
        <Picker.Item label="In Progress" value="In Progress" />
        <Picker.Item label="Completed" value="Completed" />
      </Picker>
      <Button title="Add Task" onPress={handleAddTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
});

export default AddTask;
