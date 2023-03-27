import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  FlatList,
  Dimensions
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Color } from '../Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Apiurl } from '../apicomponent/Api';
import {useIsFocused } from '@react-navigation/native';

const Teammemberdetail = (route) => {
  const isFocused = useIsFocused
  console.log('route::::::::', route.route.params.data);
  const teamId = route.route.params.data;
  const [data, setData] = useState('');
  const [profile, setProfile] = useState('');
  useEffect(() => {
    gettoken();
  }, [isFocused]);
  const gettoken = async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const daystartinfo = JSON.parse(token);
      console.log('token ::::', daystartinfo);
      teamdata(daystartinfo);
      return token != null ? JSON.parse(token) : null;
    } catch (error) {
      console.log('gettoken error', error);
    }
  };
  let teamdata = async (val) => {
    var formdata = new FormData();
    formdata.append("emp_id", teamId);
    let res = await fetch(`${Apiurl.api}/attendance-report.php`, {
      method: 'post',
      body: formdata,
      headers: {
        accesstoken: val,
      },
    })
      .then(response => response.text())
      .then(response => {
        const result = JSON.parse(response);
        setData(result.data)
        console.log('teamdata response::::::: ', result);
      })
      .catch(error => {
        console.log('team data error', error);
      });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Color.white
      }}>
      <View>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            console.log('item>>>>>>>>>>', item);
            return (
              <View style={{
                height: 150,
                width: '95%',
                marginTop: 10,
                borderRadius: 10,
                alignSelf: 'center',
                backgroundColor: 'pink'
              }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.txt}>{item.date}</Text>
                </View>
                <View style={{margin:10}}>
                  <Text style={styles.txt}>Day Plan: {item.day_plan}</Text>
                  <Text style={styles.txt}> Start Time: {item.start_time}</Text>
                  <Text style={styles.txt}>End Time: {item.end_time}</Text>
                  <Text style={styles.txt}> Work Hour: {item.worked_hours}</Text>
                </View>
              </View>
            )
          }} />
      </View>
    </SafeAreaView>
  );
};

export default Teammemberdetail;

const styles = StyleSheet.create({
  txt:{
    color:Color.black,
     fontSize:14, 
     fontWeight:'600'
    }
});
