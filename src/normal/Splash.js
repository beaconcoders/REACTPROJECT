import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Color} from '../Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const Splash = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState('');

  useEffect(() => {
    setTimeout(() => {
      // navigation.navigate('Login');
      checklogin();
    }, 2000);
  }, []);
  const checklogin = async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const daystartinfo = JSON.parse(token);
      setToken(daystartinfo);
      if (token != null) {
        navigation.navigate('Drawer');
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log('gettoken error splash screen', error);
    }
  };

  return (
    <View
      style={{
        backgroundColor: Color.white,
        flex: 1,
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        alignItems: 'center',
      }}>
      <Image
        style={styles.imagestyle}
        resizeMode="contain"
        source={require('../images/logo.png')}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  imagestyle: {
    width: '100%',
    height: '28%',
    marginVertical: '60%',
    marginHorizontal: 0,
  },
});
