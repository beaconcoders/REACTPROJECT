import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { Color } from '../Color';

const btn = ({
  width,
  height,
  marginTop,
  justifyContent,
  alignItems,
  backgroundColor,
  textcolor,
  text,
  fontSize,
  fontWeight,
  alignSelf,
  onPress,
  margin,
  borderRadius,
  image,
  heightimg,
  widthimg
}) => {
  return (
    <TouchableOpacity
      style={{
        width: width,
        height: height,
        marginTop: marginTop,
        justifyContent: justifyContent,
        alignItems: alignItems,
        alignSelf:alignSelf,
        margin:margin,
        backgroundColor: backgroundColor,
        borderRadius:borderRadius
      }}
      onPress={() => { 
        onPress();
      }}
    >
      <Image source={image} style={{height:heightimg, width:widthimg}} tintColor={Color.white}/>
      <Text style={{ 
        color: textcolor,
         fontSize:fontSize,
         fontWeight: fontWeight
          }}>{text}</Text>
    </TouchableOpacity>
  )
}

export default btn

const styles = StyleSheet.create({
})