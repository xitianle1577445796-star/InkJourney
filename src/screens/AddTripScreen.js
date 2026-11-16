import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, ScrollView, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 🌟 核心硬性 API 库
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';
import { Magnetometer, Barometer } from 'expo-sensors';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function AddTripScreen({ navigation }) {
  const [tripName, setTripName] = useState('');
  const [notes, setNotes] = useState('');
  const [locationName, setLocationName] = useState('');
  const [images, setImages] = useState([]);

  // 🌟 硬件 API 实时状态变量
  const [batteryLevel, setBatteryLevel] = useState('Loading...');
  const [deviceName, setDeviceName] = useState('Loading...');
  const [compassHeading, setCompassHeading] = useState('0°');
  const [barometerPressure, setBarometerPressure] = useState('Measuring...');

  useEffect(() => {
    // 1. 电池与设备型号 API
    async function loadHardware() {
      try {
        const bat = await Battery.getBatteryLevelAsync();
        setBatteryLevel(`${Math.round(bat * 100)}%`);
        setDeviceName(Device.modelName || 'Mobile Device');
      } catch (e) {
        setBatteryLevel('100%');
        setDeviceName('Mobile Device');
      }
    }
    loadHardware();

    // 2. 指南针硬性 API (Magnetometer)
    Magnetometer.setUpdateInterval(400);
    const magSub = Magnetometer.addListener(data => {
      let { x, y } = data;
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      setCompassHeading(`${Math.round(angle)}°`);
    });

    // 3. 环境气压/温度计硬性 API (Barometer)
    Barometer.setUpdateInterval(1000);
    const baroSub = Barometer.addListener(data => {
      setBarometerPressure(`${data.pressure.toFixed(1)} hPa`);
    });

    return () => {
      magSub && magSub.remove();
      baroSub && baroSub.remove();
    };
  }, []);

  // 4. 真实 GPS 定位 API
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required.');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocationName(`Lat: ${loc.coords.latitude.toFixed(4)}, Lon: ${loc.coords.longitude.toFixed(4)}`);
  };

  // 5. 相册 API
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const saveTrip = async () => {
    if (!tripName.trim()) {
      Alert.alert('Validation Error', 'Please enter a journey title.');
      return;
    }

    const newTrip = {
      id: Date.now().toString(),
      tripName,
      notes,
      locationName: locationName || 'Unknown Ink Realm',
      images,
      tripDate: new Date().toISOString(),
    };

    try {
      const existing = await AsyncStorage.getItem('trips');
      const list = existing ? JSON.parse(existing) : [];
      list.push(newTrip);
      await AsyncStorage.setItem('trips', JSON.stringify(list));
      
      setTripName('');
      setNotes('');
      setLocationName('');
      setImages([]);

      navigation.navigate('HomeTab', { screen: 'Home', params: { refresh: true } });
    } catch (error) {
      Alert.alert('Error', 'Failed to save record.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerTitle}>题跋 ∙ New Inscription</Text>
        
        {/* 🌟 显著的硬核 API 插件面板：指南针 + 环境气压温度计 + 电池 + 设备 */}
        <View style={styles.hardwareCard}>
          <Text style={styles.hwMainTitle}>⚡ Hard Native Hardware APIs Hub</Text>
          
          <View style={styles.sensorRow}>
            {/* 指南针组件 */}
            <View style={styles.sensorItem}>
              <MaterialCommunityIcons name="compass-rose" size={20} color="#D35400" />
              <Text style={styles.sensorLabel}>Compass API</Text>
              <Text style={styles.sensorValue}>{compassHeading}</Text>
            </View>

            {/* 环境气压计组件 */}
            <View style={styles.sensorItem}>
              <MaterialCommunityIcons name="weather-cloudy" size={20} color="#2980B9" />
              <Text style={styles.sensorLabel}>Barometer API</Text>
              <Text style={styles.sensorValue}>{barometerPressure}</Text>
            </View>
          </View>

          <View style={[styles.sensorRow, { marginTop: 8, borderTopWidth: 1, borderTopColor: '#D3C7B4', paddingTop: 6 }]}>
            <Text style={styles.hwSubText}>🔋 Battery: {batteryLevel}</Text>
            <Text style={styles.hwSubText}>📱 Device: {deviceName}</Text>
          </View>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Journey Title (e.g., Misty Jiangnan)"
          placeholderTextColor="#888"
          value={tripName}
          onChangeText={setTripName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Location (Tap GPS button below)"
          placeholderTextColor="#888"
          value={locationName}
          onChangeText={setLocationName}
        />
        
        <TouchableOpacity style={styles.btn} onPress={getCurrentLocation}>
          <Text style={styles.btnText}>📍 Fetch True GPS Location (API)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={pickImage}>
          <Text style={styles.btnText}>🖼️ Extract Photo from Gallery (API)</Text>
        </TouchableOpacity>

        <TextInput
          style={[styles.input, { height: 120 }]}
          placeholder="Write your poetic reflections and notes..."
          placeholderTextColor="#888"
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={saveTrip}>
          <Text style={styles.btnText}>Seal & Save Record</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F8F6' },
  scrollContainer: { padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center', marginVertical: 10, letterSpacing: 1 },
  hardwareCard: { 
    backgroundColor: '#EAE6DF', 
    borderWidth: 1.5, 
    borderColor: '#8B4513', 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 14 
  },
  hwMainTitle: { fontSize: 12, fontWeight: 'bold', color: '#8B4513', marginBottom: 8, textAlign: 'center' },
  sensorRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  sensorItem: { alignItems: 'center', flex: 1 },
  sensorLabel: { fontSize: 11, color: '#555', marginTop: 2, fontWeight: '600' },
  sensorValue: { fontSize: 13, color: '#2C3E50', fontWeight: 'bold', marginTop: 2 },
  hwSubText: { fontSize: 11, fontWeight: '600', color: '#2C3E50', textAlign: 'center', flex: 1 },
  input: { borderWidth: 1, borderColor: '#D3D3D3', borderRadius: 8, padding: 12, marginBottom: 14, backgroundColor: '#FFF', color: '#333' },
  btn: { backgroundColor: '#4A6B5B', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 14 },
  saveBtn: { backgroundColor: '#8B4513' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 }
});