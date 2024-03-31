import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';  // Import LoginScreen component
import DemoScreen from './screens/DemoScreen';  // Import DemoScreen component

const Stack = createNativeStackNavigator() // Create a Stack navigator

export default function App() {
  return (
  
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login"
            component={LoginScreen}
            options={{ title: 'Authentication' }}
          />
          <Stack.Screen name="Home" component={DemoScreen} />
        </Stack.Navigator>
      </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
