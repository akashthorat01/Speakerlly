import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Bot, Home, Users } from 'lucide-react-native';

import { AuthProvider, AuthContext } from './src/context/AuthContext';
import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TrainersScreen from './src/screens/TrainersScreen';
import ChatScreen from './src/screens/ChatScreen';
import { Text, View } from 'react-native';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator screenOptions={{ 
            headerShown: false,
            tabBarActiveTintColor: '#2563eb',
            tabBarInactiveTintColor: '#94a3b8',
            tabBarStyle: { borderTopWidth: 0, elevation: 15, height: 65, paddingBottom: 10, paddingTop: 10 }
        }}>
            <Tab.Screen name="Home" component={DashboardScreen} options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }} />
            <Tab.Screen name="Trainers" component={TrainersScreen} options={{ tabBarIcon: ({ color }) => <Users color={color} size={24} /> }} />
            <Tab.Screen name="Angelina AI" component={ChatScreen} options={{ tabBarIcon: ({ color }) => <Bot color={color} size={24} /> }} />
        </Tab.Navigator>
    );
}

function AppNavigator() {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) return null;

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    <Stack.Screen name="Auth" component={AuthScreen} />
                ) : (
                    <Stack.Screen name="Main" component={MainTabs} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Speakerlly Working ✅</Text>
    </View>
  );
}


export default function App() {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}
export { default } from './apps/mobile/App';
