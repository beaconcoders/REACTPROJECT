import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Color} from '../Color';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Apiurl} from '../apicomponent/Api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Teamdetail = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState('');
  const [actionData, setActionData] = useState('');
  useEffect(() => {
    gettoken();
  }, []);
  const gettoken = async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const daystartinfo = JSON.parse(token);
      setToken(daystartinfo);
      teamdata(daystartinfo);
      return token != null ? JSON.parse(token) : null;
    } catch (error) {
      console.log('gettoken error', error);
    }
  };
  let teamdata = async token => {
    let res = await fetch(`${Apiurl.api}/get_team.php`, {
      method: 'post',
      headers: {
        accesstoken: token,
      },
    })
      .then(response => response.text())
      .then(response => {
        console.log('teamdata::::::: ', JSON.parse(response));
        setActionData(JSON.parse(response).data);
      })
      .catch(error => {
        console.log('team data error', error);
      });
  };

  const RenderItem = item => {
    console.log('item >>>>>in render >>>>', item.item.id);
    const id = item.item.id;
    return (
      <View style={{flex: 1 / 3}}>
        <TouchableOpacity onPress={() => navigation.navigate('Team Member',{data:id})}>
          <View style={styles.teamdetailview}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="account-circle"
              color={Color.black}
              size={120}
            />
            <View style={styles.teamviewtext}>
              <Text style={styles.teamdetailtext}>
                <MaterialCommunityIcons
                  style={styles.icon}
                  name="account"
                  color={Color.black}
                  size={30}
                />{' '}
                {item.item.name}
              </Text>
              <Text style={styles.teamdetailtext}>
                <MaterialCommunityIcons
                  style={styles.icon}
                  name="email"
                  color={Color.black}
                  size={30}
                />{' '}
                {item.item.email}
              </Text>
              <Text style={styles.teamdetailtext}>
                <MaterialCommunityIcons
                  style={styles.icon}
                  name="phone"
                  color={Color.black}
                  size={30}
                />{' '}
                {item.item.phone}
              </Text>
              <Text style={styles.teamdetailtext}>
                <MaterialCommunityIcons
                  style={styles.icon}
                  name="trending-up"
                  color={Color.black}
                  size={30}
                />{' '}
                {item.item.role}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.scrollview}>
      <View style={{flex: 1, backgroundColor: Color.white}}>
        <FlatList
          data={actionData}
          renderItem={RenderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default Teamdetail;

const styles = StyleSheet.create({
  scrollview: {
    height: '100%',
    backgroundColor: Color.white,
  },
  teamdetailview: {
    flexDirection: 'row',
    borderColor: Color.black,
    borderWidth: 1,
    margin: 5,
    borderRadius: 5,
  },
  profileimage: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderRadius: 150,
    margin: 10,
  },
  image: {
    width: 25,
    margin: '6%',
    height: 25,
  },
  teamdetailtext: {
    color: Color.black,
    fontWeight: 500,
    fontSize: 20,
  },
  teamviewtext: {
    margin: 5,
    marginLeft: 20,
  },
});
