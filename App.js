import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './navigation/TabNavigator';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}