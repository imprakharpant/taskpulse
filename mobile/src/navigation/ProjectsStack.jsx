import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProjectsScreen } from '../screens/ProjectsScreen';
import { ProjectDetailScreen } from '../screens/ProjectDetailScreen';
import { TaskFormScreen } from '../screens/TaskFormScreen';
import { COLORS } from '../theme';

const Stack = createNativeStackNavigator();

export const ProjectsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.bgCard,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: COLORS.bg },
      }}
    >
      <Stack.Screen
        name="ProjectsList"
        component={ProjectsScreen}
        options={{ title: 'Projects' }}
      />
      <Stack.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={({ route }) => ({
          title: route.params?.projectName || 'Project Details',
        })}
      />
      <Stack.Screen
        name="TaskForm"
        component={TaskFormScreen}
        options={({ route }) => ({
          title: route.params?.isEditing ? 'Edit Task' : 'New Task',
        })}
      />
    </Stack.Navigator>
  );
};
