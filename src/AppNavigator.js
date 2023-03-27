import {StyleSheet, Text, View, Button, Image} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Splash from './normal/Splash';
import Login from './components/Login';
import Daystart from './components/Daystart';
import Homevisit from './components/Homevisit';
import Teamdetail from './components/Teamdetail';
import Teammemberdetail from './components/Teammemberdetail';
import CustomDrawer from './drawer/CustomDrawer';
import {Color} from './Color';
import Profile from './components/Profile';
import ActionList from './components/ActionList';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Daystart"
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="Daystart"
        component={Daystart}
        options={{
          headerShown: true,
          headerStyle: {
            height:60,
            borderBottomWidth: 1,
            borderBottomColor: Color.black,
          },
          headerTitle: '',
          headerRight: () => (
            <Image
              style={{
                width: '50%',
                height: 55,
                marginRight: '35%',
                marginLeft: '15%',
              }}
              source={require('./images/logo.png')}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Home Visit"
        component={Homevisit}
        options={{
          headerShown: true,
          headerStyle: {
            height:60,
            borderBottomWidth: 1,
            borderBottomColor: Color.black,
          },
          headerTitle: '',
          headerRight: () => (
            <Image
              style={{
                width: '50%',
                height: 55,
                marginRight: '35%',
                marginLeft: '15%',
              }}
              source={require('./images/logo.png')}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Team Record"
        component={Teamdetail}
        options={{
          headerShown: true,
          headerStyle: {
            height:60,
            borderBottomWidth: 1,
            borderBottomColor: Color.black,
          },
          headerTitle: '',
          headerRight: () => (
            <Image
              style={{
                width: '50%',
                height: 55,
                marginRight: '35%',
                marginLeft: '15%',
              }}
              source={require('./images/logo.png')}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Team Member"
        component={Teammemberdetail}
        options={{
          headerShown: true,
          headerStyle: {
            height:60,
            borderBottomWidth: 1,
            borderBottomColor: Color.black,
          },
          headerTitle: '',
          headerRight: () => (
            <Image
              style={{
                width: '50%',
                height: 55,
                marginRight: '35%',
                marginLeft: '15%',
              }}
              source={require('./images/logo.png')}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          headerStyle: {
            height:60,
            borderBottomWidth: 1,
            borderBottomColor: Color.black,
          },
          headerTitle: '',
          headerRight: () => (
            <Image
              style={{
                width: '50%',
                height: 55,
                marginRight: '35%',
                marginLeft: '15%',
              }}
              source={require('./images/logo.png')}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home Visit"
          component={Homevisit}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ActionList"
          component={ActionList}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
