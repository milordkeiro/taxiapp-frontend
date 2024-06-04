import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, TextInput, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

import { mapStyle } from './mapStyle';

// Function to get permission for location


export default function MapScreen({navigation}) {
  const [location, setLocation] = useState({coords:{latitude:-17.393739055665673, longitude:-66.15695309349233}});
  const [errorMsg, setErrorMsg] = useState(null);
  const [name,setName] = useState('');
  const [phone, setPhone] = useState('');
  const [detail, setDetail] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSendingForm, setIsSendingForm] = useState(false);
  //+++++++ to get current location of user or set a default one
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setMapData({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
      setMarkerData({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
    })();
    console.log("Entro para obtener la location");  
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  //
  console.log("Texto: ",text);  
  //------------------------------
  //-17.393739055665673, -66.15695309349233
  const mapRef = useRef(null);
  const [markerData, setMarkerData] = useState({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });
  const [mapData, setMapData] = useState({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  })
  
  // handleRegionChange = mapData => {
  //   setState({
  //     markerData: {latitude: mapData.latitude, longitude: mapData.longitude},
  //     mapData,
  //   });
  // };

  
  useEffect(()=>{
    validateForm();
  }, [name,phone]);

  validateForm = ()=>{
    let errors = {};
    if(!name && name.length<4)
    {
      errors.name = "El nombre es requerido con mas de 4 letras.";
    }
    if(!phone && phone.length != 8)
    {
      errors.phone = "Número de celular incorrecto";
    }
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }

  dragEndMarker = (e) =>{
    setMarkerData(e.nativeEvent.coordinate);

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
    }
  }

  submitRequest = async()=>{
    if (isFormValid) { 
      // Form is valid, perform the submission logic 
      setIsSendingForm(true);
      try {
          const addResponse = await fetch('https://taxiapp-api.innova-cube.com/v1/request',{
          method:'post',
          headers:{
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            location:location.coords.latitude+','+location.coords.longitude,
            nameUser: name,
            phoneUser: phone,
            requirements: detail,
          })
        });
        setIsSendingForm(false);
        const createdRequest = await addResponse.json();
        console.log('Solicitud', createdRequest);
        console.log('Form submitted successfully!');
        navigation.navigate('Seguimiento',{createdRequest: createdRequest});
      } catch (error) {
        setIsSendingForm(false);
        Alert.alert('Error en el envio','Por favor, verifique sus datos y/o conexión a Internet y vuelva a intentarlo.');
      }
      
    } else { 
        Alert.alert('Datos invalidos','Coloque su Nombre y Número de celular correctamente.') 
        // Form is invalid, display error messages 
        console.log('Form has errors. Please correct them.'); 
    } 
  }
  
  cancelRequest = ()=>{
    ///++++ aqui hacer la cancelacion del request al api
    setIsSendingForm(false);
  }

  return (
    <ScrollView>
      <View style={styles.container}>
      <View>
      <MapView
        ref={mapRef}
        customMapStyle={mapStyle}
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
        region={mapData}
        //onRegionChangeComplete={handleRegionChange}
        mapType="standard"
      >
        <Marker
            draggable
            coordinate={markerData}
            onDragEnd={
              (e) => 
              {
                //alert(JSON.stringify(e.nativeEvent.coordinate))
                dragEndMarker(e)
              }
              
            }
            title={'Tu ubicación actual'}
            description={'Presione largo tiempo para mover a la ubicación requerida'}
          />
      </MapView>
      </View>
      <View style={[styles.card]}>
        <Text style={[styles.titleCard]}>PIDA UN TAXI</Text>
        <Text>Tu nombre: <Text style={styles.mutedText}>(Requerido min. 4 letras)</Text></Text>
        <TextInput value={name} 
                onChangeText={setName} 
                style={styles.input} />
        <Text>Tu celular:<Text style={styles.mutedText}>(Requerido 8 dígitos)</Text></Text>
        <TextInput value={phone} 
                onChangeText={setPhone} style={styles.input} keyboardType="numeric"/>    
        <Text>Describa sus requerimientos:</Text>
        <TextInput style={styles.input} value={detail} onChangeText={setDetail} />
        <View style={styles.containerButtons}>
          <View style={styles.btnWrapper}>
          <Button onPress={submitRequest} title="WhatsApp" color="#25D366"/>
          </View>
          <View style={styles.btnWrapper}>
          <Button onPress={submitRequest} title="Enviar" color="#0C2D57"/>
          </View>
        </View>
      </View>
    </View>
    {isSendingForm? 
    <View style={styles.spinner}>
        <ActivityIndicator style={styles.spinnerIndicator} size='large' color='#fc6736'/>
        <Text style={styles.textSpinner}>Enviando...</Text>
        <Button title='Cancelar' color='#0C2D57' onPress={cancelRequest} />
    </View>
    : <></>}
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  card:{
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height:'48%',
    marginBottom: -20,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.2)',
    padding: 15,
    zIndex:2,
  },
  titleCard:{
    textAlign: 'center',
    fontSize: 24,
    color:'#0C2D57',
    fontWeight:'bold',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor:'#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom:10,
  },
  textArea:{
    borderWidth: 1,
    borderColor:'#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom:10,
  },
  containerButtons:{
    flex:1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  btnWrapper:{
    width:'50%',
    padding:5,
  },
  mutedText:{
    color:'#6c757d',
    fontSize:12,
  },
  spinner:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    height:'100%',
    backgroundColor:'#f7f7f7ba',
    position:'absolute',
    zIndex:3,
  },
  spinnerIndicator:{

  },
  textSpinner:{
    marginBottom:20,
  }
});