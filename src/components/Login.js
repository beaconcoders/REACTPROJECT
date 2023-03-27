import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import CheckBox from '@react-native-community/checkbox';
import {useNavigation} from '@react-navigation/native';
import {Color} from '../Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Apiurl} from '../apicomponent/Api';
import LinearGradient from 'react-native-linear-gradient';

const Login = () => {
  const navigation = useNavigation();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  // console.log(' phone no..........', mobile, password);
  const handlesubmit = () => {
    var myHeaders = new Headers();
    myHeaders.append('Cookie', 'PHPSESSID=9fdaffb8859f803eaabb81c0a9a750b3');

    var formdata = new FormData();
    formdata.append('mobile', mobile);
    formdata.append('password', password);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };
    // console.log('requestOptions    >>>', requestOptions);
    fetch(`${Apiurl.api}/login.php`, requestOptions)
      .then(response => response.text())
      .then(async response => {
        console.log('login >>>>>', JSON.parse(response));
        const token = JSON.parse(response).data.token;
        try {
          await AsyncStorage.setItem('TOKEN', JSON.stringify(token));
        } catch (error) {
          console.log('TOKEN async error', error);
        }
        navigation.navigate('Drawer');
      })
      .catch(error => {
        console.log('login error', error);
      });
  };

  return (
    <SafeAreaView style={{backgroundColor: Color.white, height: '100%'}}>
      <View>
        <Text style={styles.text}>Login</Text>
        <View style={styles.inputview}>
          <TextInput
            style={styles.input}
            placeholderTextColor={Color.black}
            value={mobile}
            onChangeText={mobile => setMobile(mobile)}
            placeholder="Enter mobile"
          />
          <TextInput
            style={styles.input}
            placeholderTextColor={Color.black}
            secureTextEntry
            value={password}
            onChangeText={password => setPassword(password)}
            placeholder="Enter Password"
          />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            margin: 15,
            marginTop: 15,
          }}>
          <View style={styles.checkboxWrapper}>
            <CheckBox />
            <Text style={{color: Color.black, fontWeight: 'bold'}}>
              Logged In
            </Text>
          </View>
          <View
            style={{
              margin: 5,
              marginRight: 0,
              marginLeft: '45%',
              marginTop: 10,
            }}>
            <Text style={{color: Color.blue, fontWeight: 'bold'}}>
              Forgot Password
            </Text>
          </View>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            style={{backgroundColor: Color.royalblue, borderRadius: 5}}
            onPress={handlesubmit}>
            <LinearGradient
              colors={['#0000ff', '#00ced1']}
              style={{borderRadius: 5}}>
              <Text style={styles.textbutton}>Submit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  header: {
    backgroundColor: Color.coral,
    padding: 10,
    color: Color.white,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text: {
    padding: 10,
    color: Color.black,
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 30,
  },
  inputview: {
    margin: 10,
  },
  input: {
    margin: 10,
    padding: 10,
    borderWidth: 0.5,
    top: 30,
    fontWeight: 'bold',
    fontSize: 18,
    color: Color.purple,
    borderRadius: 5,
    borderColor: Color.black,
  },
  button: {
    marginTop: 30,
    width: '70%',
    marginRight: '15%',
    marginLeft: '15%',
  },
  accountview: {
    margin: 20,
  },
  account: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Color.black,
    fontSize: 15,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textbutton: {
    textAlign: 'center',
    color: Color.white,
    justifyContent: 'center',
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold',
  },
});
