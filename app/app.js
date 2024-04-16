import React, {useEffect, useState} from "react";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from "./Login"; // Import Login Component
import Home from "./Home"; // Import Home component
import SignUp from "./SignUp"; // Import SignUp component
import ImagePage from "./ImagePage"; // Import ImagePage component
import ForgotPass from "./ForgotPass";

const Stack = createNativeStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{
            title: "Login Screen"
          }} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ImagePage" component={ImagePage} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

