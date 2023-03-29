import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Platform,
  PermissionsAndroid
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Color } from '../Color';
import { Apiurl } from '../apicomponent/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Next from '../images/next.png';
import back from '../images/back.png';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-simple-toast';

const ActionList = () => {
  const [action_list, setAction_List] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    gettoken();
  }, []);
  // get token
  const gettoken = async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const daystartinfo = JSON.parse(token);
      setToken(daystartinfo);
      getactionlist(daystartinfo)
      return token != null ? JSON.parse(token) : null;
    } catch (error) {
      console.log('gettoken error...........', error);
    }
  };

  // Show Toast to response msg
  const showToast = title => {
    Toast.show(title, Toast.SHORT, Toast.BOTTOM)
  }
  //  get action list  in api , and modal State
  let getactionlist = async (val) => {
    setLoading(true)
    let res = await fetch(`${Apiurl.api}/action_list.php`, {
      method: 'post',
      headers: {
        accesstoken: val,
      },
    })
      .then(response => response.text())
      .then(response => {
        setAction_List(JSON.parse(response).data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log('get action list error', error);
      });
  };
  let actionlist = async (listId) => {
    setLoading(true);
    const data = new FormData();
    data.append('action_id', listId.id);
    let res = await fetch(`${Apiurl.api}/get_action.php`, {
      method: 'post',
      body: data,
      headers: {
        accesstoken: token,
      },
    })
      .then(response => response.text())
      .then(response => {
        let result = JSON.parse(response);
        if (result.data[0] === null) {
          getLocationTOUseAction(listId);
          setLoading(false);
        } else {
          navigation.navigate('Home Visit', { data: result.data, listId: listId })
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('get action data error...', error);
      });
  };
  const getLocationTOUseAction = async (listId) => {
    // const hasPermission = await hasLocationPermission();

    // if (!hasPermission) {
    //   return;
    // }
    Geolocation.getCurrentPosition(
      position => {
        let longitude = position.coords.longitude;
        let latitude = position.coords.latitude;
        let location = latitude + ', ' + longitude;
        action_insert({ location, listId });
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
      },
    );
  };
  let action_insert = async ({ location, listId }) => {
    const data = new FormData();
    data.append('action_id', listId.id);
    data.append('location', location);
    let res = await fetch(`${Apiurl.api}/action_insert.php`, {
      method: 'post',
      body: data,
      headers: {
        accesstoken: token,
      },
    })
      .then(response => response.text())
      .then(response => {
        showToast(JSON.parse(response).msg)
      })
      .catch(error => {
        console.log('action insert error...', error);
      });
  };
  // const hasLocationPermission = async () => {
  //   if (Platform.OS === 'ios') {
  //     const hasPermission = await hasPermissionIOS();
  //     return hasPermission;
  //   }
  //   if (Platform.OS === 'android' && Platform.Version < 23) {
  //     return true;
  //   }
  //   const hasPermission = await PermissionsAndroid.check(
  //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //   );
  //   if (hasPermission) {
  //     return true;
  //   }
  //   const status = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //   );
  //   if (status === PermissionsAndroid.RESULTS.GRANTED) {
  //     return true;
  //   }
  //   if (status === PermissionsAndroid.RESULTS.DENIED) {
  //     ToastAndroid.show(
  //       'Location permission denied by user.',
  //       ToastAndroid.LONG,
  //     );
  //   } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
  //     ToastAndroid.show(
  //       'Location permission revoked by user.',
  //       ToastAndroid.LONG,
  //     );
  //   }
  //   return false;
  // };
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Color.white }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.btn}
            onPress={() => navigation.navigate('Daystart')}>
            <Image source={back} style={{ height: 25, width: 25, }} />
          </TouchableOpacity>
          <Text style={styles.txtbtn}>ACTION LIST</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <ActivityIndicator
            size={'large'}
            color={Color.btn}
            animating={true} />
        </View>
      </View>
    )
  } else {
    return (
      <View style={{ flex: 1, backgroundColor: Color.white }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.btn}
            onPress={() => navigation.navigate('Daystart')}>
            <Image source={back} style={{ height: 25, width: 25, }} />
          </TouchableOpacity>
          <Text style={styles.txtbtn}>ACTION LIST</Text>
        </View>
        <FlatList
          data={action_list}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={styles.Action_listbtn}
                onPress={() => {
                  actionlist(item);
                }}>
                <Text style={styles.txtbtn}>{item.action_name}</Text>
                <Image source={Next} style={{ height: 20, width: 20 }} tintColor={Color.white}/>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    )
  }
}

export default ActionList

const styles = StyleSheet.create({
  Action_listbtn: {
    height: 50,
    backgroundColor: Color.btn,
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row'
  },
  txtbtn: {
    fontSize: 14,
    color: Color.white,
    fontWeight: '600',
  },
  header: {
    height: 60,
    width: Dimensions.get('window').width,
    // backgroundColor:'pink',
    flexDirection: 'row',
    alignItems: 'center',
    // paddingStart:20,
    borderBottomWidth: 0.2
  },
  btn: {
    height: 35,
    width: 35,
    backgroundColor: Color.white,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    borderRadius: 6
  }
})