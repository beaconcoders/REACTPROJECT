import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Color } from '../Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Profile = (route) => {
  let profileDetails = route.route.params.data;
  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.containerHead}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: Color.white }}>Profile</Text>
        <MaterialCommunityIcons
          style={styles.icon}
          name="account-circle"
          color={Color.white}
          size={120}
        />
      </View>
      <View style={{ flex: 1 / 1.6, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 30 }}>
        <View style={styles.teamviewtext}>
          <View style={styles.textContainer}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="account"
              color={Color.black}
              size={30}
            />
            <Text style={styles.teamdetailtext}>
              {profileDetails.name}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="email"
              color={Color.black}
              size={30}
            />
            <Text style={styles.teamdetailtext}>
              {profileDetails.email}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="phone"
              color={Color.black}
              size={30}
            />
            <Text style={styles.teamdetailtext}>
              {profileDetails.phone}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="trending-up"
              color={Color.black}
              size={30}
            />
            <Text style={styles.teamdetailtext}>
              {profileDetails.role}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: Color.white
  },
  containerHead: {
    flex: 1 / 2.5,
    backgroundColor: Color.btn,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 10,
  },
  icon: {
    marginBottom: 20,
  },
  teamviewtext: {
    margin: 5,
    marginLeft: 20,
  },
  teamdetailtext: {
    color: Color.black,
    fontWeight: '500',
    fontSize: 20,
    marginBottom:20,
    marginHorizontal:20
  },
  textContainer:{
    flexDirection:'row',
    alignItems:'center',
  }
});
