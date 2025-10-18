import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import TabNavigator from './navigation/TabNavigator';
import NewsDetailScreen from './screens/NewsDetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
        >
          {/* Main tab navigation */}
          <Stack.Screen name="MainTabs" component={TabNavigator} />

          {/* Full news detail screen */}
          <Stack.Screen name="NewsDetail" component={NewsDetailScreen}  />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
