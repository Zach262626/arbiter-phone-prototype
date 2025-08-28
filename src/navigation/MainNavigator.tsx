import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, MainTabParamList } from '../types';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import ChecksheetsScreen from '../screens/ChecksheetsScreen';
import PunchlistsScreen from '../screens/PunchlistsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProjectDetailsScreen from '../screens/ProjectDetailsScreen';
import ChecksheetDetailsScreen from '../screens/ChecksheetDetailsScreen';
import PunchlistDetailsScreen from '../screens/PunchlistDetailsScreen';
import ChecksheetCompletionScreen from '../screens/ChecksheetCompletionScreen';
import ReportsScreen from '../screens/ReportsScreen';
import WeeklyReportScreen from '../screens/WeeklyReportScreen';
import KPIReportScreen from '../screens/KPIReportScreen';
import CustomCheckReportScreen from '../screens/CustomCheckReportScreen';
import FileManagementScreen from '../screens/FileManagementScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Projects') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'Checksheets') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Punchlists') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{ title: 'Projects' }}
      />
      <Tab.Screen
        name="Checksheets"
        component={ChecksheetsScreen}
        options={{ title: 'Checksheets' }}
      />
      <Tab.Screen
        name="Punchlists"
        component={PunchlistsScreen}
        options={{ title: 'Punchlists' }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ title: 'Reports' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProjectDetails"
        component={ProjectDetailsScreen}
        options={{ title: 'Project Details' }}
      />
      <Stack.Screen
        name="ChecksheetDetails"
        component={ChecksheetDetailsScreen}
        options={{ title: 'Checksheet Details' }}
      />
      <Stack.Screen
        name="PunchlistDetails"
        component={PunchlistDetailsScreen}
        options={{ title: 'Punchlist Details' }}
      />
      <Stack.Screen
        name="ChecksheetCompletion"
        component={ChecksheetCompletionScreen}
        options={{ title: 'Complete Checksheet' }}
      />
      <Stack.Screen
        name="WeeklyReport"
        component={WeeklyReportScreen}
        options={{ title: 'Weekly Report' }}
      />
      <Stack.Screen
        name="KPIReport"
        component={KPIReportScreen}
        options={{ title: 'KPI Report' }}
      />
      <Stack.Screen
        name="CustomCheckReport"
        component={CustomCheckReportScreen}
        options={{ title: 'Custom Check Report' }}
      />
      <Stack.Screen
        name="FileManagement"
        component={FileManagementScreen}
        options={{ title: 'File Management' }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
