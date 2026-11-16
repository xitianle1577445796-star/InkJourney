import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';
import { Magnetometer } from 'expo-sensors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  const { themeMode, toggleTheme, colors } = useContext(ThemeContext);

  const [batteryLevel, setBatteryLevel] = useState('Loading...');
  const [deviceName, setDeviceName] = useState('Loading...');
  const [compassHeading, setCompassHeading] = useState('Detecting...');

  useEffect(() => {
    async function loadHardwareInfo() {
      try {
        const bat = await Battery.getBatteryLevelAsync();
        setBatteryLevel(bat >= 0 ? `${Math.round(bat * 100)}%` : 'AC Power');
        const dev = Device.modelName || Device.deviceName || 'Mobile Device';
        setDeviceName(dev);
      } catch (error) {
        setBatteryLevel('N/A');
        setDeviceName('N/A');
      }
    }
    loadHardwareInfo();

    Magnetometer.setUpdateInterval(1000);
    const subscription = Magnetometer.addListener(data => {
      let { x, y } = data;
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      setCompassHeading(`${Math.round(angle)}°`);
    });

    return () => subscription && subscription.remove();
  }, []);

  const resetData = async () => {
    Alert.alert(
      'Reset Chronicles',
      'Are you sure you want to reset all local journal data?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('far_ink_masterpiece_v8');
            Alert.alert('Success', 'Chronicles reset to default.');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>⚙️ App Settings & Diagnostics</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.rowLeft}>
            <Ionicons name="color-palette-outline" size={22} color={colors.accent || '#8B4513'} />
            <View style={{marginLeft: 12}}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Zen Theme Mode</Text>
              <Text style={[styles.sub, { color: colors.textSecondary }]}>{themeMode === 'dark' ? 'Charcoal Ink (Dark)' : 'Rice Paper (Light)'}</Text>
            </View>
          </View>
          <Switch value={themeMode === 'dark'} onValueChange={toggleTheme} trackColor={{ true: '#4A6B5B' }} />
        </View>

        <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.rowLeft}>
            <Ionicons name="battery-charging-outline" size={22} color="#2980B9" />
            <View style={{marginLeft: 12}}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>🔋 Battery Status API</Text>
              <Text style={[styles.sub, { color: colors.textSecondary }]}>Level: {batteryLevel}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.rowLeft}>
            <Ionicons name="phone-portrait-outline" size={22} color="#8E44AD" />
            <View style={{marginLeft: 12}}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>📱 Device Hardware API</Text>
              <Text style={[styles.sub, { color: colors.textSecondary }]}>{deviceName}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.rowLeft}>
            <MaterialCommunityIcons name="compass-outline" size={22} color="#D35400" />
            <View style={{marginLeft: 12}}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>🧭 Compass Heading</Text>
              <Text style={[styles.sub, { color: colors.textSecondary }]}>{compassHeading}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.resetButton, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={resetData}>
          <Text style={{ color: '#C0392B', fontWeight: 'bold', fontSize: 14 }}>🗑️ Reset Local Chronicles Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 54, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', fontFamily: 'serif' },
  content: { padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 14 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  label: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  sub: { fontSize: 12 },
  resetButton: { padding: 16, borderRadius: 14, borderWidth: 1, alignItems: 'center', marginTop: 10 }
});