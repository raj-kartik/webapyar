import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from './src/Pages/Login'
import Signup from './src/Pages/Signup'
import Form from './src/Pages/Form/Form'

const App = () => {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Signup' screenOptions={{
        headerShown: false
      }} >
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Signup' component={Signup} />
        <Stack.Screen name='Form' component={Form} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App