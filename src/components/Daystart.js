import {
  SafeAreaView,
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  BackHandler
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Color } from '../Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Apiurl } from '../apicomponent/Api';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-simple-toast';
import MultiUseBtn from './MultiUseBtn';
import start from '../images/time.png';
import Plan from '../images/planning.png';
import EndDay from '../images/logout.png';
import Action from '../images/action-plan.png';
import Report from '../images/clipboard.png';
import team from '../images/team.png'
const Daystart = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState('');
  const [visual, setVisual] = useState(false);
  const [visual2, setVisual2] = useState(false);
  const [updatePlan, setUpdatePlan] = useState('');
  const [location, setLocation] = useState('');
  const [id, setId] = useState('');
  const isFocused = useIsFocused();
  useEffect(() => {
    gettoken();
    getUserDetails();
  }, [isFocused]);
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert('Exit App', 'Are you sure you want to go back?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]);
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [navigation])

  // Show Toast to response msg
  const showToast = title => {
    Toast.show(title, Toast.SHORT, Toast.BOTTOM)
  }
  const getUserDetails = async () => {
    try {
      const userDetails = await AsyncStorage.getItem('ID');
      const  userId  = JSON.parse(userDetails).id;
      console.log('getUserDetails userId>>>>>>>', userId);
      setId(userId);
      return userId != null ? JSON.parse(userId) : null;
    } catch (error) {
      console.log('getUserDetails error...........', error);
    }
  };
  // get token
  const gettoken = async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const daystartinfo = JSON.parse(token);
      setToken(daystartinfo);
      return token != null ? JSON.parse(token) : null;
    } catch (error) {
      console.log('gettoken error...........', error);
    }
  };
  // get time to show
  let newTime = new Date().toLocaleTimeString();
  let newDate = new Date().toLocaleDateString();

  // get location latitude & longitude to use Start Day
  const getLocationStartDay = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }
    Geolocation.getCurrentPosition(
      position => {
        let longitude = position.coords.longitude;
        let latitude = position.coords.latitude;
        let location = latitude + ', ' + longitude;
        starDay(location);
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
  // send longitude & latitude  in api , and modal state
  let starDay = async (locationStart) => {
    var myHeaders = new Headers();
    myHeaders.append("accesstoken", token);

    var formdata = new FormData();
    formdata.append("last_location", locationStart);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };
    let res = await fetch(`${Apiurl.api}/start-day.php`, requestOptions)
      .then(response => response.text())
      .then(response => {
        let result = JSON.parse(response)
        showToast(result.msg);
      },
      )
      .catch(error => {
        console.log('getlocation error', error);
      });
  };
  // send remarks in day plan, and modal State
  let updateDayPlan = async () => {
    // if (updatePlan !== null) {
    //   Alert.alert('Write Remarks !')
    // }
    const data = new FormData();
    data.append('day_plan', updatePlan);
    let res = await fetch(Apiurl.api + 'day_plan.php', {
      method: 'post',
      body: data,
      headers: {
        accesstoken: token,
      },
    })
      .then(response => response.text())
      .then(response => {
        let result = JSON.parse(response)
        showToast(result.msg);
        // if (result.error ===false) {
        setVisual(false);
        // }
        console.log('getdayplan response', result);
      })
      .catch(error => {
        setVisual(false);
        console.log('getdayplan error', error);
      });
  };
  // get location latitude & longitude to use End Day
  const getLocationEndtDay = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }
    Geolocation.getCurrentPosition(
      position => {
        let longitude = position.coords.longitude;
        let latitude = position.coords.latitude;
        let location = latitude + ', ' + longitude;
        setVisual2(true);
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
  //submit Day end location and closed Day 
  let endDay = async () => {
    const data = new FormData();
    data.append('last_location', location);
    let res = await fetch(Apiurl.api + 'end-day.php', {
      method: 'post',
      body: data,
      headers: {
        accesstoken: token,
      },
    })
      .then(response => response.text())
      .then(response => {
        let result = JSON.parse(response);
        console.log('endday response', result, result.msg);
        setVisual2(false);
        showToast(result.msg);
      })
      .catch(error => {
        setVisual2(false);
        console.log('endday error', error);
      });
  };

  return (
    <SafeAreaView style={{
      backgroundColor: Color.white,
      flex: 1,
    }}>
      <KeyboardAvoidingView style={{
        backgroundColor: Color.white,
        flex: 1,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 40 }}>
          {/* Day Start Btn */}
          <MultiUseBtn
            width={150}
            height={80}
            image={start}
            widthimg={28}
            heightimg={28}
            backgroundColor={Color.btn}
            marginTop={20}
            margin={10}
            textcolor={'white'}
            text={'DAY START'}
            fontSize={14}
            fontWeight={'500'}
            justifyContent={'space-around'}
            alignItems={'center'}
            borderRadius={10}
            onPress={() => { getLocationStartDay() }} />

          {/**Day plan btn */}
          <MultiUseBtn
            width={150}
            height={80}
            image={Plan}
            widthimg={28}
            heightimg={28}
            backgroundColor={Color.btn}
            marginTop={20}
            margin={10}
            textcolor={'white'}
            text={'DAY PLAN'}
            fontSize={16}
            fontWeight={'600'}
            justifyContent={'space-around'}
            alignItems={'center'}
            borderRadius={10}
            onPress={() => { setVisual(true) }} />
        </View>
        {/**Day plan Modal to submit remarks */}
        <Modal
          visible={visual}
          animationType={'slide'}
          transparent={true}
          onRequestClose={() => {
            setVisual(!visual)
          }}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.btn}
              onPress={() => setVisual(false)}>
              <Text style={[styles.txt, { color: Color.white }]}>X</Text>
            </TouchableOpacity>
            <View style={styles.modal_inr}>
              <View style={{ height: 50, alignSelf: 'center', justifyContent: 'center' }}>
                <Text style={styles.txt}>DAY PLAN</Text>
              </View>
              <TextInput
                placeholder='Remarks'
                placeholderTextColor={Color.black}
                onChangeText={txt => setUpdatePlan(txt)}
                style={styles.input}
                autoCapitalize={'none'}
                keyboardType={'default'}
                multiline={true}
                color={Color.black}
              />
              <MultiUseBtn
                width={100}
                height={60}
                image={Action}
                backgroundColor={Color.btn}
                marginTop={20}
                margin={10}
                textcolor={'white'}
                text={'Submit'}
                fontSize={14}
                fontWeight={'500'}
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={10}
                onPress={() => { updateDayPlan() }} />
            </View>
          </View>
        </Modal>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {/**Action plan btn */}
          <MultiUseBtn
            width={150}
            height={80}
            image={Action}
            widthimg={28}
            heightimg={28}
            backgroundColor={Color.btn}
            marginTop={20}
            margin={10}
            textcolor={'white'}
            text={'ACTION'}
            fontSize={14}
            fontWeight={'500'}
            justifyContent={'space-around'}
            alignItems={'center'}
            borderRadius={10}
            onPress={() => { navigation.navigate('ActionList') }} />
          {/**Day Report btn */}
          <MultiUseBtn
            width={150}
            height={80}
            image={Report}
            widthimg={28}
            heightimg={28}
            backgroundColor={Color.btn}
            marginTop={20}
            margin={10}
            textcolor={'white'}
            text={'DAY REPORT'}
            fontSize={16}
            fontWeight={'600'}
            justifyContent={'space-around'}
            alignItems={'center'}
            borderRadius={10}
            onPress={() => { navigation.navigate('Team Member', { data: id })}} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <MultiUseBtn
            width={150}
            height={80}
            image={team}
            widthimg={30}
            heightimg={30}
            backgroundColor={Color.btn}
            marginTop={20}
            margin={10}
            textcolor={'white'}
            text={'Team'}
            fontSize={16}
            fontWeight={'600'}
            justifyContent={'space-around'}
            alignItems={'center'}
            borderRadius={10}
            onPress={() => {navigation.navigate('Team Record') }} />
          {/**Day End btn */}
          <MultiUseBtn
            width={150}
            height={80}
            image={EndDay}
            widthimg={28}
            heightimg={28}
            backgroundColor={Color.btn}
            marginTop={20}
            margin={10}
            textcolor={'white'}
            text={'DAY END'}
            fontSize={14}
            fontWeight={'500'}
            justifyContent={'space-around'}
            alignItems={'center'}
            borderRadius={10}
            onPress={() => { getLocationEndtDay() }} />
        </View>
        {/** Day End Modal */}
        <Modal
          visible={visual2}
          animationType={'slide'}
          transparent={true}
          onRequestClose={() => {
            setVisual2(!visual2)
          }}>
          <View style={styles.modal}>
            <View style={styles.modal_inr}>
              <View style={{ height: 50, alignSelf: 'center', justifyContent: 'center' }}>
                <Text style={styles.txt}>DAY END</Text>
              </View>
              <View style={{ height: 50, alignSelf: 'center', justifyContent: 'center' }}>
                <Text style={styles.txt}>Are, you sure want to end Day !</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <MultiUseBtn
                  width={100}
                  height={60}
                  image={Action}
                  backgroundColor={Color.red}
                  marginTop={20}
                  margin={10}
                  textcolor={'white'}
                  text={'No'}
                  fontSize={14}
                  fontWeight={'500'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  borderRadius={10}
                  onPress={() => { setVisual2(false) }} />
                <MultiUseBtn
                  width={100}
                  height={60}
                  image={Action}
                  backgroundColor={Color.green}
                  marginTop={20}
                  margin={10}
                  textcolor={'white'}
                  text={'Yes'}
                  fontSize={14}
                  fontWeight={'500'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  borderRadius={10}
                  onPress={() => { endDay() }} />
              </View>
            </View>
          </View>

        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Daystart;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal_inr: {
    backgroundColor: Color.white,
    height: Dimensions.get('window').height * 0.4,
    width: Dimensions.get('window').width * 0.9,
    borderRadius: 10,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Dropdown_header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  Dropdown: {
    backgroundColor: Color.white,
    height: Dimensions.get('window').height * 0.4,
    width: Dimensions.get('window').width * 0.9,
    borderRadius: 10,
    elevation: 2,
    margin: 40,
  },
  input: {
    height: 80,
    width: '90%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  txt: {
    fontSize: 16,
    color: Color.black,
    fontWeight: '800',
  },
  btn: {
    height: 50,
    width: 50,
    borderRadius: 25,
    elevation: 6,
    backgroundColor: Color.btn,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnAction: {
    position: 'absolute',
    top: 2,
    bottom: 0,
    left: '91%',
    right: 0,
    height: 30,
    width: 30,
    borderRadius: 15,
    elevation: 6,
    backgroundColor: Color.red,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
