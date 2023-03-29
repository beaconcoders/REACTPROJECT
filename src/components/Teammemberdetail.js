import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Modal,
  Image
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Color } from '../Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Apiurl } from '../apicomponent/Api';
import { useIsFocused } from '@react-navigation/native';
import MultiUseBtn from '../components/MultiUseBtn';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Time from '../images/time.png';
import EndTime from '../images/timeleft.png';
import DayPlan from '../images/planning.png';
import address from '../images/home.png';
import Remarks from '../images/list.png';
import Profile from '../images/user.png';
import phone from '../images/phone.png';


const Teammemberdetail = (route) => {
  const isFocused = useIsFocused();
  const teamId = route.route.params.data;
  const [data, setData] = useState('');
  const [report, setReport] = useState('');
  const [attendanceShow, setAttendanceShow] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState('');
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const tem = new Date(date);
    const New = tem.toISOString().split('T');
    const newDate = New[0].split('-');
    searchAttendance(newDate[2] + '-' + newDate[1] + '-' + newDate[0]);
    hideDatePicker();
  };
  let searchAttendance = async (date) => {
    setIsLoading(true);
    var formdata = new FormData();
    formdata.append("emp_id", teamId);
    formdata.append("date", date);
    let res = await fetch(`${Apiurl.api}/attendance-report.php`, {
      method: 'post',
      body: formdata,
      headers: {
        accesstoken: token,
      },
    })
      .then(response => response.text())
      .then(response => {
        const result = JSON.parse(response);
        setData(result.data)
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.log('searchAttendance data error', error);
      });
  };
  let teamdata = async (val) => {
    setIsLoading(true);
    var formdata = new FormData();
    formdata.append("emp_id", teamId);
    let res = await fetch(`${Apiurl.api}/attendance-report.php`, {
      method: 'post',
      body: formdata,
      headers: {
        accesstoken: val,
      },
    })
      .then(response => response.text())
      .then(response => {
        const result = JSON.parse(response);
        setData(result.data)
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.log('attendance data error', error);
      });
  };
  const handleActionConfirm = (date) => {
    const tem = new Date(date);
    const New = tem.toISOString().split('T');
    const newDate = New[0].split('-');
    actionReportSearch(newDate[2] + '-' + newDate[1] + '-' + newDate[0]);
    hideDatePicker();
  };
  let actionReportSearch = async (date) => {
    setIsLoading(true);
    var formdata = new FormData();
    formdata.append("emp_id", teamId);
    formdata.append("date", date);
    let res = await fetch(`${Apiurl.api}/action-report.php`, {
      method: 'post',
      body: formdata,
      headers: {
        accesstoken: token,
      },
    })
      .then(response => response.text())
      .then(response => {
        const result = JSON.parse(response);
        setReport(result.data)
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.log('action-report data error', error);
      });
  };
  let actionReport = async () => {
    setIsLoading(true);
    var formdata = new FormData();
    formdata.append("emp_id", teamId);
    let res = await fetch(`${Apiurl.api}/action-report.php`, {
      method: 'post',
      body: formdata,
      headers: {
        accesstoken: token,
      },
    })
      .then(response => response.text())
      .then(response => {
        const result = JSON.parse(response);
        setReport(result.data)
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.log('action-report data error', error);
      });
  };
  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Color.white,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <View>
          <ActivityIndicator
            size={'large'}
            color={Color.btn}
            animating={true} />
        </View>
      </SafeAreaView>
    )
  } else {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Color.white
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <MultiUseBtn
            height={50}
            width={'40%'}
            backgroundColor={Color.btn}
            text={'Attendance'}
            textcolor={Color.white}
            fontSize={14}
            fontWeight={'bold'}
            justifyContent={'center'}
            alignItems={'center'}
            margin={10}
            borderRadius={10}
            onPress={() => setAttendanceShow(true)} />

          <MultiUseBtn
            height={50}
            width={'40%'}
            backgroundColor={Color.btn}
            text={'Report'}
            textcolor={Color.white}
            fontSize={14}
            fontWeight={'bold'}
            justifyContent={'center'}
            alignItems={'center'}
            margin={10}
            borderRadius={10}
            onPress={() => {
              setAttendanceShow(false);
              actionReport();
            }}
          />
        </View>
        {attendanceShow === true ?
          <View style={{ flex: 1, marginBottom: 10 }}>
            <View style={styles.searchHeader}>
              <TouchableOpacity style={styles.search}
                onPress={() => showDatePicker()}>
                <MaterialCommunityIcons
                  style={styles.icon}
                  name="calendar-month"
                  color={Color.white}
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            {data && data.length > 0 ?
              <FlatList
                data={data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                  return (
                    <View style={{
                      // height: 170,
                      width: '95%',
                      marginTop: 10,
                      borderRadius: 10,
                      alignSelf: 'center',
                      backgroundColor: '#1358BB',
                      padding: 10
                    }}>
                      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <Text style={styles.txt}>Date: {item.date}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ margin: 10, justifyContent: 'center', alignItems: 'center' }}>
                          <Image source={Time} style={{ height: 20, width: 20 }} tintColor={Color.white} />
                          <Text style={styles.txt}>Start Time: {item.start_time}</Text>
                        </View>
                        <View style={{ margin: 10, justifyContent: 'center', alignItems: 'center' }}>
                          <Image source={EndTime} style={{ height: 20, width: 20 }} tintColor={Color.white} />
                          <Text style={styles.txt}>End Time: {item.end_time}</Text>
                        </View>
                      </View>
                      <View style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={EndTime} style={{ height: 20, width: 20, marginRight: 10 }} tintColor={Color.white} />
                        <Text style={styles.txt}>Work Hour: {item.worked_hours}</Text>
                      </View>
                      <View style={{ marginHorizontal: 10, marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={DayPlan} style={{ height: 20, width: 20, marginRight: 10 }} tintColor={Color.white} />
                        <Text style={styles.txt}>Day Plan: {item.day_plan}</Text>
                      </View>
                      {/* </View> */}
                      {/* <View style={{ flexDirection: 'row', height: 30, }}>
                    <TouchableOpacity style={styles.btn}
                      onPress={() => { Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${item.start_location}`) }}>
                      <Text style={styles.txtBtn}> Start Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn}>
                      <Text style={styles.txtBtn}> End Location</Text>
                    </TouchableOpacity>
                  </View> */}
                    </View>
                  )
                }} />
              :
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 14, color: '#000' }}>No record found.</Text>
              </View>}
          </View>
          :
          <View style={{ flex: 1, marginBottom: 10 }}>
            <View style={styles.searchHeader}>
              <TouchableOpacity style={styles.search}
                onPress={() => showDatePicker()}>
                <MaterialCommunityIcons
                  style={styles.icon}
                  name="calendar-month"
                  color={Color.white}
                  size={30}
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleActionConfirm}
                onCancel={hideDatePicker}
              />
            </View>
            {report && report.length > 0 ?
              <FlatList
                data={report}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                  if (item.data && item.data.length > 2) {
                    const temp = JSON.parse(item.data);
                    return (
                      <View style={{
                        // height: 150,
                        width: '95%',
                        marginTop: 10,
                        borderRadius: 10,
                        alignSelf: 'center',
                        backgroundColor: '#1358BB',
                        padding: 10
                      }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                          <Text style={styles.txt}>{item.action_name}</Text>
                        </View>
                        {temp.Name == undefined ? null :
                          <View style={{ margin: 10, flexDirection: 'row', alignItems: 'center', width: '90%' }}>
                            <Image source={Profile} style={{ height: 20, width: 20, marginRight: 10 }} tintColor={Color.white} />
                            <Text style={styles.txt}>Name: {temp.Name}</Text>
                          </View>
                        }
                        {temp["Phone No."] == undefined ? null :
                          <View style={{ margin: 10, flexDirection: 'row', alignItems: 'center', width: '90%' }}>
                            <Image source={phone} style={{ height: 20, width: 20, marginRight: 10 }} tintColor={Color.white} />
                            <Text style={styles.txt}>Phone No.: {temp["Phone No."]}</Text>
                          </View>
                        }
                        {temp.Address == undefined ? null :
                          <View style={{ margin: 10, flexDirection: 'row', alignItems: 'center', width: '90%' }}>
                            <Image source={address} style={{ height: 20, width: 20, marginRight: 10 }} tintColor={Color.white} />
                            <Text style={styles.txt}>Address: {temp.Address}</Text>
                          </View>
                        }
                        {temp.Remarks == undefined ? null :
                          <View style={{ margin: 10, flexDirection: 'row', alignItems: 'center', width: '90%' }}>
                            <Image source={Remarks} style={{ height: 20, width: 20, marginRight: 10 }} tintColor={Color.white} />
                            <Text style={styles.txt}>Remarks: {temp.Remarks}</Text>
                          </View>
                        }
                      </View>
                    )
                  } else {
                    return null;
                  }
                }} />
              :
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 14, color: '#000' }}>No record found.</Text>
              </View>}

          </View>}

      </SafeAreaView>
    );
  }
};

export default Teammemberdetail;

const styles = StyleSheet.create({
  txt: {
    color: Color.white,
    fontSize: 14,
    fontWeight: '600'
  },
  btn: {
    height: '100%',
    width: '30%',
    backgroundColor: Color.btn,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 10
  },
  txtBtn: {
    color: Color.white,
    fontSize: 14,
    fontWeight: '600'
  },
  searchHeader: {
    height: 50,
    width: '90%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  search: {
    height: 40,
    width: '20%',
    backgroundColor: Color.btn,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  }
});
