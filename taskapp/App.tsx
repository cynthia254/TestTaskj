import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import EditTask from './components/EditTask';
import { Task } from './src/text'; // Ensure you have a Task interface defined

const Stack = createNativeStackNavigator();

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]); // Now using TypeScript

  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks function
  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks); // Update state
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  // Handle adding a new task
  const handleAddTask = (newTask: Task) => {
    saveTasks([...tasks, newTask]);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Task List">
          {(props) => <TaskList {...props} tasks={tasks} setTasks={setTasks} />} 
        </Stack.Screen>
        <Stack.Screen name="Add Task">
          {(props) => <AddTask {...props} saveTask={handleAddTask} />}
        </Stack.Screen>
        <Stack.Screen name="Edit Task">
          {(props) => <EditTask {...props} saveTask={saveTasks} tasks={tasks} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
