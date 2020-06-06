import React from 'react';
import { StatusBar } from 'react-native';
import Routes from './src/routes'
import {AppLoading} from 'expo'
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu'
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto'

export default function App() {
  const [ fontsLoaded ] = useFonts({
    Roboto_400Regular, Roboto_500Medium, Ubuntu_700Bold
  })

  if (!fontsLoaded) return <AppLoading/>

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
      <Routes/>
    </>
    
  );
}

/* 

  // Exemplo de estilização
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); */
