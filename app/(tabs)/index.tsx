import 'expo-router/entry'
import { StyleSheet, FlatList, Pressable, Dimensions, ImageBackground } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'expo-image';
import { usePhotoGalery } from '@/context/PhotoGalery';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { colorSecondary } from '@/constants/Colors';
import { useEffect } from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import { Center } from '@/components/ui/center';
// import { HStack } from '@/components/ui/hstack';
// import { Box } from '@/components/ui/box';
// import fetchPhotos from '@/models/fetchPhotos';

const image = '../../assets/images/photo-film-background.png'

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const STATE = usePhotoGalery();

  useEffect(() => {
    // fetchPhotos(STATE.setPhotos)
    return STATE.setSelected(null)
  }, [])

  const handleSelect = (item: any) => {
    if (item !== STATE.selected) {
      STATE.setSelected(item),
      navigation.navigate('preview')
    } else STATE.setSelected(null)
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['left', 'right']}>
        <ImageBackground style={styles.imageBack} source={require(image)} resizeMode='repeat' >
          <ThemedView style={[styles.container, { marginBottom: 170 }]}>
            <ThemedText style={[styles.titleContainer, { borderRadius: 50, padding: 5, marginTop: -10, backgroundColor: STATE.photos.length ? 'orange' : 'red' }]} type='title'>{
              STATE.photos.length ? 'Sessão de Fotos' : 'Clique na camera e comece a fotografar'
            }</ThemedText>
            {!STATE.photos.length && (
              <Pressable style={{ alignItems: 'center', marginTop: 8 }} onPress={() => navigation.navigate('camera')}>
                <IconSymbol style={{ borderColor: 'white', borderBottomWidth: 6, borderTopWidth: 6, borderRadius: 50 }} size={200} name="camera" color={'white'} />
              </Pressable>
            )}
              {STATE.photos.length ? (
                <FlatList
                  data={STATE.photos}
                  renderItem={({ item }) => (
                      <ThemedView>
                        <Pressable onPress={() => handleSelect(item)}>
                          <Image
                            source={item.uri}
                            contentFit="cover"
                            style={[styles.image, { borderBlockColor: STATE.selected && STATE.selected.id == item.id ? 'red' : colorSecondary }]}
                          />
                        </Pressable>
                      </ThemedView>
                  )}
                  style={{ alignSelf: 'center' }}
                  keyExtractor={item => item.id}
                />
              ) : (
                <></>
              )}
          </ThemedView>
        </ImageBackground >
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 5
  },
  container: {
    borderRadius: 15,
    backgroundColor: 'transparent',
    padding: 10
  },
  image: {
    width: 'auto',
    aspectRatio: 1,
    minHeight: 200,
    borderWidth: 5,
    marginBottom: 10
  },
  imageBack: {
    marginTop: 45,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height
  }
});
