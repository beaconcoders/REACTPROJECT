import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  ActivityIndicator
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Color } from '../Color';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Apiurl } from '../apicomponent/Api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Teamdetail = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [token, setToken] = useState('');
  const [actionData, setActionData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    gettoken();
  }, [isFocused]);
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
    setIsLoading(true);
    let res = await fetch(`${Apiurl.api}/get_team.php`, {
      method: 'post',
      headers: {
        accesstoken: token,
      },
    })
      .then(response => response.text())
      .then(response => {
        setActionData(JSON.parse(response).data);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.log('team data error', error);
      });
  };

  const RenderItem = item => {
    const id = item.item.id;
    return (
      <View style={{ flex: 1 / 3 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Team Member', { data: id })}>
          <View style={styles.teamdetailview}>
            {/* <MaterialCommunityIcons
              style={styles.icon}
              name="account-circle"
              color={Color.black}
              size={120}
            /> */}
            <View style={styles.teamviewtext}>
              <Text style={styles.teamdetailtext}>
                <MaterialCommunityIcons
                  style={styles.icon}
                  name="account"
                  color={Color.white}
                  size={30}
                />{' '}
                {item.item.name}
              </Text>
              <Text style={styles.teamdetailtext}>
                <MaterialCommunityIcons
                  style={styles.icon}
                  name="email"
                  color={Color.white}
                  size={30}
                />{' '}
                {item.item.email}
              </Text>
              <Text style={styles.teamdetailtext}>
                <MaterialCommunityIcons
                  style={styles.icon}
                  name="phone"
                  color={Color.white}
                  size={30}
                />{' '}
                {item.item.phone}
              </Text>
              <Text style={styles.teamdetailtext}>
                <MaterialCommunityIcons
                  style={styles.icon}
                  name="trending-up"
                  color={Color.white}
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
  if (isLoading) {
    return (
      <SafeAreaView style={styles.scrollview}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <ActivityIndicator
            size={'large'}
            color={Color.btn}
            animating={true} />
        </View>
      </SafeAreaView>
    )
  } else {
    return (
      <SafeAreaView style={styles.scrollview}>
        <View style={{ flex: 1, backgroundColor: Color.white }}>
          <FlatList
            data={actionData}
            renderItem={RenderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </SafeAreaView>
    );
  }
};

export default Teamdetail;

const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
    backgroundColor: Color.white,
  },
  teamdetailview: {
    flexDirection: 'row',
    // borderColor: Color.black,
    backgroundColor:Color.btn,
    borderWidth: 1,
    margin: 5,
    borderRadius: 5,
    borderRadius:10
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
    color: Color.white,
    fontWeight: 500,
    fontSize: 20,
  },
  teamviewtext: {
    margin: 5,
    marginLeft: 20,
  },
});
