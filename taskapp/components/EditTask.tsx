
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Picker } from 'react-native';
import { Task } from '../src/text'; // Adjust this based on your folder structure

interface EditTaskProps {
  saveTask: (updatedTasks: Task[]) => void;
  navigation: any;
  route: any; // Use a more specific type if available
}

const EditTask: React.FC<EditTaskProps> = ({ saveTask, navigation, route }) => {
  const { task } = route.params;

  const [name, setName] = useState(task.name);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [status, setStatus] = useState(task.status);

  const handleEditTask = () => {
    const updatedTask: Task = { ...task, name, dueDate, status };

    saveTask((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
    );

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
        placeholder="Due Date"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
      />
      <Picker
        selectedValue={status}
        style={styles.picker}
        onValueChange={(itemValue) => setStatus(itemValue)}>
        <Picker.Item label="To Do" value="To Do" />
        <Picker.Item label="In Progress" value="In Progress" />
        <Picker.Item label="Completed" value="Completed" />
      </Picker>
      <Button title="Save Changes" onPress={handleEditTask} />
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
    width: '100%',
    marginBottom: 10,
  },
});

export default EditTask;