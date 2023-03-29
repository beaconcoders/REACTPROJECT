import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Color } from '../Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Apiurl } from '../apicomponent/Api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MultiUseBtn from '../components/MultiUseBtn'
const CustomDrawer = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState('');
  const [visual2, setVisual2] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    gettoken();
    getUserDetails();
  });
  const getUserDetails = async () => {
    try {
      const userDetails = await AsyncStorage.getItem('ID');
      const  userId  = JSON.parse(userDetails).id;
      setRole(JSON.parse(userDetails).role);
      return userId != null ? JSON.parse(userId) : null;
    } catch (error) {
      console.log('getUserDetails error...........', error);
    }
  };
  const gettoken = async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const daystartinfo = JSON.parse(token);
      setToken(daystartinfo);
      return token != null ? JSON.parse(token) : null;
    } catch (error) {
      console.log('gettoken error', error);
    }
  };

  let Logout = async () => {
    let res = await fetch(`${Apiurl.api}/logout.php`, {
      method: 'post',
      headers: {
        accesstoken: token,
      },
    })
      .then(response => response.text())
      .then(response => {
        let result = JSON.parse(response)
        setVisual2(false);
        if (result.error === false) {
          AsyncStorage.removeItem('TOKEN');
          AsyncStorage.removeItem('ID');
          navigation.navigate('Login');
        }
      },
      )
      .catch(error => {
        setVisual2(false);
        console.log('logout error', error);
      });
  };

  let profile = async () => {
    let res = await fetch(`${Apiurl.api}/profile.php`, {
      method: 'post',
      headers: {
        accesstoken: token,
      },
    })
      .then(response => response.text())
      .then(
        response => {
          let result = JSON.parse(response);
          if (result.error === false) {
            navigation.navigate('Profile',{data:result.data})
          }
        },
      )
      .catch(error => {
        console.log('profile error', error);
      });
  };

  return (
    <View style={{ flex: 1, height: '100%' }}>
      <Image style={styles.imagestyle} source={require('../images/logo.png')} />
      <View style={styles.imageview} />
      <TouchableOpacity onPress={() => navigation.navigate('Daystart')}>
        <View style={styles.customimage}>
          <MaterialCommunityIcons
            style={styles.icon}
            name="home"
            color={Color.royalblue}
            size={30}
          />
          <Text style={styles.drawercomponenttext}>Dashboard</Text>
        </View>
      </TouchableOpacity>
      {role === 'manager' ? 
      <TouchableOpacity onPress={() => navigation.navigate('Team Record')}>
        <View style={styles.customimage}>
          <MaterialCommunityIcons
            style={styles.icon}
            name="account-group"
            color={Color.royalblue}
            size={30}
          />
          <Text style={styles.drawercomponenttext}>Team</Text>
        </View>
      </TouchableOpacity>
      : null}
      {/* <TouchableOpacity>
        <View style={styles.customimage}>
          <MaterialCommunityIcons
            style={styles.icon}
            name="calendar-month"
            color={Color.royalblue}
            size={30}
          />
          <Text style={styles.drawercomponenttext}>Day Plan/Report</Text>
        </View>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={() => setVisual2(true)}>
        <View style={styles.customimage}>
          <MaterialCommunityIcons
            style={styles.icon}
            name="logout"
            color={Color.royalblue}
            size={30}
          />
          <Text style={styles.drawercomponenttext}>Logout</Text>
        </View>
      </TouchableOpacity>
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
              <Text style={styles.txt}>Log Out</Text>
            </View>
            <View style={{ height: 50, alignSelf: 'center', justifyContent: 'center' }}>
              <Text style={styles.txt}>Are, you sure want to logout !</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <MultiUseBtn
                width={100}
                height={60}
                // image={Action}
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
                // image={Action}
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
                onPress={() => { Logout() }} />
            </View>
          </View>
        </View>

      </Modal>
      <TouchableOpacity onPress={() => profile()}>
        <View style={styles.customimage}>
          <MaterialCommunityIcons
            style={styles.icon}
            name="account-circle"
            color={Color.royalblue}
            size={30}
          />
          <Text style={styles.drawercomponenttext}>Profile</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  imagestyle: {
    marginVertical: '5%',
    marginHorizontal: '10%',
    width: '80%',
  },
  imageview: {
    borderBottomColor: Color.black,
    borderBottomWidth: 1,
  },
  customimage: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Color.black,
    backgroundColor: Color.white,
    borderRadius: 10,
    margin: 3,
  },
  icon: {
    margin: '6%',
  },
  drawercomponenttext: {
    margin: '6%',
    fontSize: 20,
    fontWeight: 500,
    color: Color.black,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
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
  txt: {
    fontSize: 16,
    color: Color.black,
    fontWeight: '800',
  },
});
