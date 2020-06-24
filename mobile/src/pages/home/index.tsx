import React, {useState} from 'react'
import {View, ImageBackground, Image, StyleSheet, Text,Platform, TextInput, KeyboardAvoidingView} from 'react-native'
import{RectButton} from 'react-native-gesture-handler'
import {Feather as Icon} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'

 

const home = () => {
  const [uf, setUf] = useState ('')
  const [city, setCity] = useState ('')

const Navigation = useNavigation()

function handleNavigationToPoints(){
  Navigation.navigate('Points',{
    uf,
    city

    }
  )
}

    return (
      <KeyboardAvoidingView  style = {{flex:1}} behavior = {Platform.OS === 'ios'?"padding":undefined} >
    <ImageBackground source={require('../../assets/home-background.png')} 
    style={styles.container}
    imageStyle = {{width:274 , height : 368}}
    >
        <View style = {styles.main}>
        <Image source = {require('../../assets/logo.png')}/>
       <View>
       <Text style={styles.title}> Seu marketplace de coleta de resíduo</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
       </View>

        </View>
        <TextInput  
        style = {styles.input}
         placeholder = ' Digite a UF'
         maxLength = {2}
         autoCapitalize = 'characters'
         autoCorrect = {false}
         value = {uf}
         onChangeText = {text => setUf(text)}
         ></TextInput>
            <TextInput 
            style = {styles.input}
             placeholder = ' Digite a cidade'
             autoCorrect = {false}
             value = {city}
             onChangeText = {text => setCity(text)}
             ></TextInput>
           
        <View style = {styles.footer}></View>
        <RectButton style={styles.button} onPress = {handleNavigationToPoints}>
        <View style = {styles.buttonIcon}>
        <Text>
            <Icon name = 'arrow-right' color = '#fff' size = {24}/>
            </Text> 
            </View>
            <Text style = {styles.buttonText}>Entrar</Text>
        </RectButton>
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
  
    select: {},
  
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



export default home;