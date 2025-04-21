import { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';

import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { usePhotoGalery } from '@/context/PhotoGalery';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export default function GetLocation() {
  const STATE = usePhotoGalery()
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getCurrentLocation() {
      if (Platform.OS === 'android' && !Device.isDevice) {
        STATE.setErrorMsg(
          'Ops, isso não funciona no Snack em um emulador Android. Experimente no seu dispositivo!'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        STATE.setErrorMsg('A permissão para acessar o local foi negada');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      STATE.setLocation(location);
    }

    getCurrentLocation();

    STATE.location || STATE.errorMsg ? setLoading(false) : setLoading(true);
  }, [STATE.location, STATE.errorMsg]);

  return (
    loading ? (
      <ThemedText style={styles.paragraph} type='title'>Carregando...</ThemedText>
    ) : (
      STATE.errorMsg ? (
        <ThemedText style={styles.paragraph} type='defaultSemiBold'>{STATE.errorMsg}</ThemedText>
      ) : (
        STATE.location && (
          <ThemedView style={styles.container}>
            <ThemedText style={styles.paragraph} type='defaultSemiBold'>{`Data/Hora: ${JSON.stringify(new Date(STATE.location.timestamp).toLocaleString())}`}</ThemedText>
            <ThemedText style={styles.paragraph} type='defaultSemiBold'>{`Latitude: ${JSON.stringify(STATE.location.coords.latitude)} | Longitude: ${JSON.stringify(STATE.location.coords.longitude)}`}</ThemedText>
          </ThemedView>
        )
      )
    )
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'orange',
    paddingVertical: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  paragraph: {
    color: 'black',
    textAlign: 'center',
  },
});
