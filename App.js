import { useEffect } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MapScreen from './components/MapScreen'
import TrakingScreen from './components/TrakingScreen';

// const requestLocationPermission = async ()=>{
  
// }
const Stack = createNativeStackNavigator();

export default function App() {
  // useEffect(() => {
  //   const requestLocationPermission = async () => {
  //     if (Platform.OS === 'android') {
  //       try {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //           {
  //             title: 'Permiso de Localizacion',
  //             message: 'La aplicación necesita acceder a tu ubicacion.',
  //             buttonNeutral: 'Preguntar luego',
  //             buttonNegative: 'Cancelar',
  //             buttonPositive: 'Aceptar',
  //           }
  //         );
  //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //           console.log('Permiso de ubicacion concedido');
  //         } else {
  //           console.log('Permiso de ubicacion denegado');
  //         }
  //       } catch (err) {
  //         console.warn(err);
  //       }
  //     }
  //   };

  //   requestLocationPermission();
  // }, []);

  return (
    // <View style={styles.container}>
    //   <MapScreen></MapScreen>
    // </View>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Inicio'>
        <Stack.Screen name='Inicio' component={MapScreen} options={{headerShown: false}}/>
        <Stack.Screen name='Seguimiento' component={TrakingScreen} />
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
