import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function TripDetailsScreen({ route, navigation }) {
  const { trip } = route.params;

  const [tripName, setTripName] = useState(trip.tripName || '');
  const [notes, setNotes] = useState(trip.notes || '');
  const [locationName, setLocationName] = useState(trip.locationName || '');

  const [mapRegion] = useState({
    latitude: trip.latitude || 55.8427,
    longitude: trip.longitude || -4.4373,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
  });

  const handleUpdate = async () => {
    if (!tripName.trim()) {
      Alert.alert('错误', '行程标题不能为空！');
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem("trips");
      let tripsList = existingData ? JSON.parse(existingData) : [];
      const index = tripsList.findIndex((t) => t.id === trip.id);

      if (index !== -1) {
        tripsList[index] = {
          ...tripsList[index],
          tripName: tripName,
          notes: notes,
          locationName: locationName,
        };

        await AsyncStorage.setItem("trips", JSON.stringify(tripsList));
        Alert.alert('成功', '行程已成功更新！', [
          { text: '确定', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('错误', '未找到该条记录');
      }
    } catch (error) {
      console.log("Update error:", error);
      Alert.alert('错误', '更新失败，请重试');
    }
  };

  const handleDelete = async () => {
    Alert.alert('确认删除', '你确定要删除这条行记吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定删除',
        style: 'destructive',
        onPress: async () => {
          try {
            const existingData = await AsyncStorage.getItem("trips");
            let tripsList = existingData ? JSON.parse(existingData) : [];
            const filtered = tripsList.filter((t) => t.id !== trip.id);
            await AsyncStorage.setItem("trips", JSON.stringify(filtered));
            navigation.goBack();
          } catch (error) {
            console.log("Delete error", error);
          }
        }
      }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>编辑与更新行记 (Update)</Text>

      <View style={styles.mapCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="map" size={18} color="#27AE60" />
          <Text style={styles.cardTitle}>Live Location & Map View</Text>
        </View>
        <View style={styles.mapContainer}>
          <MapView style={styles.map} region={mapRegion} showsUserLocation={true}>
            <Marker
              coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }}
              title={tripName || "Travel Destination"}
              description={locationName || "Recorded Location"}
            >
              <View style={styles.markerContainer}>
                <Ionicons name="navigate" size={20} color="#C0392B" style={{transform: [{rotate: '45deg'}]}} />
              </View>
            </Marker>
          </MapView>
        </View>
      </View>

      <Text style={styles.label}>行程标题 (Title)</Text>
      <TextInput style={styles.input} value={tripName} onChangeText={setTripName} placeholder="修改标题..." />

      <Text style={styles.label}>位置信息 (Location)</Text>
      <TextInput style={styles.input} value={locationName} onChangeText={setLocationName} placeholder="修改位置..." />

      <Text style={styles.label}>感想与题跋 (Reflections)</Text>
      <TextInput style={[styles.input, styles.textArea]} value={notes} onChangeText={setNotes} placeholder="修改感想..." multiline />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.btnText}>保存修改 (Save Update)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.btnText}>删除记录 (Delete)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f6f5f0', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#1c1917' },
  mapCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 13, fontWeight: 'bold', color: '#8B4513', marginLeft: 6 },
  mapContainer: {
    height: 180,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  map: { ...StyleSheet.absoluteFillObject },
  markerContainer: {
    backgroundColor: 'white',
    padding: 3,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#C0392B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 14, fontWeight: '600', color: '#57534e', marginTop: 10, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#d1d5db', padding: 10, borderRadius: 8, backgroundColor: '#fff', fontSize: 15 },
  textArea: { height: 90, textAlignVertical: 'top' },
  updateButton: { backgroundColor: '#1c1917', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  deleteButton: { backgroundColor: '#dc2626', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10, marginBottom: 30 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' }
});