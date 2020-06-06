import React, { useState, useEffect } from 'react'
import  { View, ImageBackground, Image, StyleSheet, Text,
   KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect, { PickerStyle } from 'react-native-picker-select'
// depois veja como manipular a interface PickerStyle que deve ser para estilizar
// o pickerSelect

interface IBGEUfSigla {
  sigla: string
}

interface IBGECityName {
  nome: string
}

const Home = () => {
    
    const [ ufsFormated, setUfsFormated ] = useState([])
    const [ selectedUf, setSelectedUf ] = useState('0')
    const [ selectedCity, setSelectedCity ] = useState('0')
    const [ townsFormated, setTownsFormated ] = useState([])

    const navigation = useNavigation()

    const handleNavigateToPoints = () => {
      
      if (selectedCity === '0' || selectedUf === '0')
      Alert.alert('Ação Inválida', `Selecione uma cidade e um estado`)
      else
      navigation.navigate('Points', { selectedUf, selectedCity })
    }

    useEffect(() => {

      const getEstados = async() => {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        const estados = await response.json()

        const UfInitialsFormated = estados.map((uf: IBGEUfSigla) => {
          return { label: uf.sigla, value: uf.sigla}
        })
        setUfsFormated(UfInitialsFormated)
      
      } 
      getEstados()
    },[])

    useEffect(() => {

      if (selectedUf === '0') return

      const getTowns = async() => {
        
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        const towns = await response.json()

        const townsNames = towns.map((town: IBGECityName) => {
          return { label: town.nome, value: town.nome }
        })

        setTownsFormated(townsNames)
      }
      getTowns()

    },[selectedUf])

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding': undefined}>
        <ImageBackground source={require('../../assets/home-background.png')}
         style={styles.container}  imageStyle={{ width: 274, height: 368 }}>
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')}/>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
            </View>   

            <View style={styles.footer}>
                <RNPickerSelect onValueChange={(value) => setSelectedUf(value)}
                placeholder={{label: 'Selecione um Estado', value: null}}
                items={ufsFormated} />

                <RNPickerSelect onValueChange={(value) => setSelectedCity(value)}
                placeholder={{label: 'Selecione uma Cidade', value: null}}
                items={townsFormated} />

                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#fff" size={24} />
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>  
        </ImageBackground>
      </KeyboardAvoidingView>
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  // esse deve ser o do picker-select
    select: {
      height: 60,
      backgroundColor: '#fff',
      borderRadius: 10
    },
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home