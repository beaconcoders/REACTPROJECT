import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Color } from '../Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Apiurl } from '../apicomponent/Api';
import Geolocation from 'react-native-geolocation-service';
import MultiUseBtn from '../components/MultiUseBtn';
import back from '../images/back.png';

const Homevisit = (route) => {
  const listId = route.route.params.data;
  const actionID = route.route.params.listId.id;
  const Action_Name = route.route.params.listId.action_name;
  console.log('route in home Visit>>>>>', Action_Name);
  const navigation = useNavigation();
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState({});
  const [location, setLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    gettoken();
  }, []);
  const gettoken = async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const daystartinfo = JSON.parse(token);
      console.log('daystartinfo>>>>', daystartinfo);
      setToken(daystartinfo);
      // action_insert(daystartinfo);
      getLocation();
      return token != null ? JSON.parse(token) : null;
    } catch (error) {
      console.log('gettoken error...........', error);
    }
  };
  // get location latitude & longitude to use Start Day
  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }
    Geolocation.getCurrentPosition(
      position => {
        let longitude = position.coords.longitude;
        let latitude = position.coords.latitude;
        let location = latitude + ', ' + longitude;
        setLocation(location);
        console.log('positon of location :;:::::::', location, position);
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        console.log(error);
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
  //  location Permission 
  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };

  let action_insert = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("accesstoken", token);
    myHeaders.append("Cookie", "PHPSESSID=aa78f0f48b260649aa13d06e2ee86f31");

    var formdata = new FormData();
    formdata.append("action_id", actionID);
    formdata.append("location", location);
    formdata.append("data", JSON.stringify(userData));
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };
    let res = await fetch(`${Apiurl.api}/action_insert.php`, requestOptions)
      .then(response => response.text())
      .then(result => {
        let responseList = JSON.parse(result);
        console.log(responseList)
        if (responseList.error === false) {
          setLoading(false);
          navigation.navigate('ActionList')
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('error', error)
      });
  };
  const handleInputChange = (inputName, inputValue) => {
    setUserData({ ...userData, [inputName]: inputValue });
  };
  if (loading) {
    <SafeAreaView
      style={{ backgroundColor: Color.white, flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btn}
          onPress={() => navigation.navigate('ActionList')}>
          <Image source={back} style={{ height: 25, width: 25, }} />
        </TouchableOpacity>
        <Text style={styles.txtbtn}>{Action_Name}</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
        <ActivityIndicator
          size={'large'}
          color={Color.btn}
          animating={true} />
      </View>
    </SafeAreaView>
  } else {
    return (
      <SafeAreaView
        style={{ backgroundColor: Color.white, flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.btn}
            onPress={() => navigation.navigate('ActionList')}>
            <Image source={back} style={{ height: 25, width: 25, }} />
          </TouchableOpacity>
          <Text style={styles.txtbtn}>{Action_Name}</Text>
        </View>
        <View style={{ margin: 10 }}>
          {listId.map((input) => (
            <View key={input.id}>
              <Text tyle={styles.fieldtitle}>{input.input_title}</Text>
              <TextInput
                style={styles.inputfield}
                type={input.input_type}
                placeholderTextColor={Color.black}
                placeholder={input.input_placeholder}
                onChangeText={(text) =>
                  handleInputChange(input.input_title, text)
                }
              />
            </View>
          )
          )}
        </View>
        <View style={{ alignItems: 'center' }}>
          <MultiUseBtn
            height={50}
            width={'80%'}
            margin={10}
            borderRadius={10}
            backgroundColor={Color.btn}
            text={'Submit'}
            textcolor={Color.white}
            fontSize={14}
            fontWeight={'600'}
            justifyContent={'center'}
            alignItems={'center'}
            onPress={() => {
              action_insert();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
};

export default Homevisit;

const styles = StyleSheet.create({
  fieldtitle: {
    fontSize: 18,
    padding:6,
    fontWeight: '500',
    color: Color.black,
  },
  inputfield: {
    borderWidth: 1,
    margin: 6,
    fontSize: 16,
    color: Color.black,
    borderRadius: 5,
    borderColor: Color.black,
    paddingHorizontal:6
  },
  header: {
    height: 60,
    width: Dimensions.get('window').width,
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
  },
  txtbtn: {
    fontSize: 14,
    color: Color.black,
    fontWeight: '600',
  },
});
