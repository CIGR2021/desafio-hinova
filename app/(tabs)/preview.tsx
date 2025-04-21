import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Image } from 'expo-image';
import { usePhotoGalery } from '@/context/PhotoGalery';
import { ThemedView } from '@/components/ThemedView';
import { colorPrimary } from '@/constants/Colors';
import { useEffect } from 'react';

const logo = '../../assets/images/react-logo.png'

export default function TabTwoScreen() {
  const STATE = usePhotoGalery()

  useEffect(() => {
    !STATE.photos.length && STATE.setSelected(null)
  }, [STATE.selected])

  return (
    <ScrollView>
      <ThemedView
        style={[styles.container, { backgroundColor: STATE.photos.length ? colorPrimary : 'red' }]}>
        {STATE.photos.length && STATE.selected?.uri ?
          (<Image
            source={STATE.selected.uri}
            contentFit="cover"
            style={styles.image}
          />)
          :
          (<Image
            source={require(logo)}
            contentFit="contain"
            style={styles.image}
          />)}
        <ThemedText style={styles.titleContainer} type='title'>Informações</ThemedText>
        <ThemedText style={{alignSelf: 'flex-start'}} type="defaultSemiBold">{`Data / Hora : ${STATE.selected ? new Date(STATE.selected.informations.dataHora).toLocaleString() : 'xx/xx/xxxx yy:yy'}`}</ThemedText>
        <ThemedText style={{alignSelf: 'flex-start'}} type="defaultSemiBold">{`Latitude / Longitude : ${STATE.selected ? STATE.selected.informations.latitude : '-xxxxxxxxxx'} / ${STATE.selected ? STATE.selected.informations.longitude : 'yyyyyyyyyy'}`}</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    width: Dimensions.get('screen').width / 1.13,
    color: 'white',
    borderTopWidth: 1,
    borderTopColor: 'white'
  },
  image: {
    width: Dimensions.get('screen').width / 1.1,
    minHeight: Dimensions.get('screen').height / 1.6,
    borderBlockColor: 'orange'
  },
  container: {
    marginTop: 35,
    margin: 12,
    padding: 10,
    borderRadius: 15,
    alignItems: 'center'
  }
});
