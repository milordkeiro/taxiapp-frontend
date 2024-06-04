import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image  } from 'react-native';
const newRequestIcon = require('../assets/request-icon-100x100.png')
const responseRequestIcon = require('../assets/verify-icon-100x100.png')



export default function TrakingScreen({route})
{
    const {createdRequest} = route.params;
    const [request, setRequest] = useState(createdRequest);

    const interval = setInterval(async() => {
        try {
            const getRequest = await fetch('https://taxiapp-api.innova-cube.com/v1/request/'+request.idrequest,{
                method:'get',
            });
            const requestInfo = await getRequest.json();
            console.log("Request", requestInfo);
            setRequest(requestInfo);
        } catch (error) {
            console.error(error);
        }
        
      }, 10000);

    return(
    <View style={styles.container}>
        <Text style={styles.text}>Seguimiento del estado del pedido:</Text>
        <Text>Codigo: {request.idrequest}</Text>
        <Text>Nombre: {request.nameUser}</Text>
        <Text>Celular: {request.phoneUser}</Text>
        <Text>Requerimientos: {request.requirements? request.requirements: '--'}</Text>
        {
            request.listStatus.map((statusRequest,key)=>{
                return(
                    <View style={styles.timelineCard} key={key}>
                        <View style={[styles.timelineIcon, styles.boxShadow, styles.androidShadow]}>
                            {(statusRequest.idstatus===1)?<Image source={newRequestIcon} style={styles.icon}></Image>:<></>}
                            {(statusRequest.idstatus===2)?<Image source={responseRequestIcon} style={styles.icon}></Image>:<></>}
                        </View>
                        <View style={[styles.contentTimeline, styles.boxShadow, styles.androidShadow] }>
                            <Text style={styles.textContentTimeline}>{statusRequest.date}</Text>
                            <Text style={styles.textContentTimeline}>Estado: {statusRequest.nameStatus}</Text>
                            {statusRequest.detail? <Text style={[styles.textContentTimeline, styles.textBold]}>{statusRequest.detail}</Text>:<></>}
                        </View>
                    </View>
                )
            })
        }
    </View>
    )
}

const styles = StyleSheet.create ({
    container:{
        flex:1,
        padding:15
    },
    text:{
        fontSize:14
    },
    timelineCard:{
        marginTop:20,
        flexDirection:'row',
        
    },
    timelineIcon:{
        backgroundColor:'#fff',
        borderRadius:40,
        width:70,
        height:70,
        justifyContent: 'center',
        alignItems: 'center',
        elevation:10,
    },
    icon:{
        width:40,
        height:40,
    },
    contentTimeline:{
        backgroundColor:'#fff',
        borderRadius:10,
        padding:15,
        marginLeft:10,
        flex: 1,
    },
    boxShadow:{
        alignItems: 'center',
        shadowColor:'#333333',
        shadowOffset:{
            width:3,
            height:3,
        },
        shadowOpacity:0.4,
        shadowRadius:3,
    },
    androidShadow:{
        elevation:5,
    },
    textContentTimeline:{
        textAlign:'left',
        width:'100%',   
    },
    textBold:{fontWeight:'bold'},
})