import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, View, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';
import { Magnetometer, Accelerometer } from 'expo-sensors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HardwareDemoScreen({ navigation }) {
  // 硬性 API 状态变量
  const [batteryLevel, setBatteryLevel] = useState('Fetching API...');
  const [deviceName, setDeviceName] = useState('Fetching API...');
  const [compassHeading, setCompassHeading] = useState('0°');
  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
  const [loadingMap, setLoadingMap] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: 55.8427,
    longitude: -4.4373,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
  });
  const [locationText, setLocationText] = useState('Requesting Location GPS API...');

  useEffect(() => {
    async function fetchHardAPIs() {
      try {
        // 1. 电池硬性 API (expo-battery)
        const bat = await Battery.getBatteryLevelAsync();
        setBatteryLevel(bat >= 0 ? `${Math.round(bat * 100)}%` : 'AC Powered');
        
        // 2. 设备硬件 API (expo-device)
        const dev = Device.modelName || 'Standard Mobile Device';
        setDeviceName(dev);

        // 3. 定位与地图 GPS 硬性 API (expo-location)
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeout: 5000,
          });
          
          if (loc && loc.coords) {
            const lat = loc.coords.latitude;
            const lon = loc.coords.longitude;
            setMapRegion({
              latitude: lat,
              longitude: lon,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            });
            setLocationText(`GPS API Connected — Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);
          }
        } else {
          setLocationText('Location permission not granted.');
        }
      } catch (error) {
        setLocationText('GPS API Error or Weak Signal');
      } finally {
        setLoadingMap(false);
      }
    }

    fetchHardAPIs();

    // 4. 磁力计指南针硬性 API (expo-sensors Magnetometer)
    Magnetometer.setUpdateInterval(300);
    const magSub = Magnetometer.addListener(data => {
      let { x, y } = data;
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      setCompassHeading(`${Math.round(angle)}°`);
    });

    // 5. 加速度计运动硬性 API (expo-sensors Accelerometer)
    Accelerometer.setUpdateInterval(300);
    const accelSub = Accelerometer.addListener(result => {
      setAccelData(result);
    });

    return () => {
      magSub && magSub.remove();
      accelSub && accelSub.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部工具栏 */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.toolbarTitle}>Hard APIs Dashboard</Text>
        <View style={{width: 30}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* 地图与 GPS API 组件 */}
        <View style={styles.mapCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="navigate-circle" size={20} color="#27AE60" />
            <Text style={styles.cardTitle}>1. expo-location (GPS & Map API)</Text>
          </View>
          <Text style={styles.statusText}>{locationText}</Text>

          <View style={styles.mapContainer}>
            {loadingMap ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#27AE60" />
                <Text style={styles.loadingText}>Loading GPS API...</Text>
              </View>
            ) : (
              <MapView style={styles.map} region={mapRegion} showsUserLocation={true}>
                <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }}>
                  <View style={styles.markerContainer}>
                    <Ionicons name="navigate" size={22} color="#C0392B" style={{transform: [{rotate: '45deg'}]}} />
                  </View>
                </Marker>
              </MapView>
            )}
          </View>
        </View>

        {/* 硬件传感器硬性 API 网格 */}
        <View style={styles.gridRow}>
          {/* 指南针 API */}
          <View style={styles.smallCard}>
            <MaterialCommunityIcons name="compass" size={22} color="#D35400" />
            <Text style={styles.smallTitle}>2. Magnetometer API</Text>
            <Text style={styles.smallText}>{compassHeading}</Text>
          </View>

          {/* 电池 API */}
          <View style={styles.smallCard}>
            <Ionicons name="battery-charging" size={22} color="#2980B9" />
            <Text style={styles.smallTitle}>3. Battery API</Text>
            <Text style={styles.smallText}>{batteryLevel}</Text>
          </View>
        </View>

        {/* 加速度计硬性 API */}
        <View style={styles.wideCard}>
          <MaterialCommunityIcons name="axis-arrow" size={22} color="#8E44AD" />
          <Text style={styles.smallTitle}>4. Accelerometer Motion API (Shake phone to test)</Text>
          <Text style={styles.accelText}>
            X: {accelData.x.toFixed(2)}  |  Y: {accelData.y.toFixed(2)}  |  Z: {accelData.z.toFixed(2)}
          </Text>
        </View>

        {/* 设备系统 API */}
        <View style={styles.wideCard}>
          <Ionicons name="phone-portrait" size={22} color="#16A085" />
          <Text style={styles.smallTitle}>5. expo-device Info API</Text>
          <Text style={styles.smallText}>{deviceName}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F8F6' },
  toolbar: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0D6C3',
    paddingHorizontal: 15,
  },
  toolButton: { width: 30, alignItems: 'center' },
  toolbarTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', fontFamily: 'serif' },
  scrollContainer: { padding: 16 },
  mapCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D3C7B4',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#8B4513', marginLeft: 6 },
  statusText: { fontSize: 12, color: '#555', marginBottom: 8 },
  mapContainer: {
    height: 200,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0D6C3',
  },
  map: { ...StyleSheet.absoluteFillObject },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
  loadingText: { marginTop: 8, fontSize: 12, color: '#666' },
  markerContainer: {
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C0392B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  smallCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D3C7B4',
    borderRadius: 10,
    padding: 12,
    marginRight: 6,
    alignItems: 'center',
  },
  wideCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D3C7B4',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    width: '100%',
  },
  smallTitle: { fontSize: 12, fontWeight: 'bold', color: '#8B4513', marginTop: 4, marginBottom: 2 },
  smallText: { fontSize: 13, color: '#2C3E50', fontWeight: 'bold' },
  accelText: { fontSize: 12, color: '#2C3E50', fontWeight: '600', marginTop: 2 }
});