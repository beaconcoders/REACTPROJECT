import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {Color} from '../Color';
const Headerimage = () => {
  return (
    <View style={{backgroundColor: Color.white, height: '100%'}}>
      <Image style={styles.imagestyle} source={require('../images/logo.png')} />
    </View>
  );
};

export default Headerimage;

const styles = StyleSheet.create({
  imagestyle: {
    width: '100%',
    height: '20%',
    marginVertical: '60%',
  },
});
