import { useRef, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraMode, CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GetLocation from '@/components/Location';
import { usePhotoGalery } from '@/context/PhotoGalery';
import usePhotos from '@/controllers/crudPhotos';
// import { addDoc, collection, Timestamp } from 'firebase/firestore';
// import db from '@/config/firebase';

export default function CameraScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef<CameraView>(null);
    const [mode, setMode] = useState<CameraMode>("picture");
    const [facing, setFacing] = useState<CameraType>("back");
    const [flash, setFlash] = useState<FlashMode>("off");

    const STATE = usePhotoGalery()

    if (!permission) {
        return null;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: "center" }}>
                    Precisamos da sua permissão para usar a câmera
                </Text>
                <Button onPress={requestPermission} title="Conceder permissão" />
            </View>
        );
    }

    const takePicture = async () => {
        const photo = await ref.current?.takePictureAsync();
        STATE.setUri(photo ? photo.uri : null);
    };

    const save = () => {
        STATE.photos.length ? (
            STATE.setPhotos([...STATE.photos, {
                id: STATE.photos.length + 1,
                uri: STATE.uri,
                informations: {
                    'dataHora': STATE.location?.timestamp,
                    'latitude': STATE.location?.coords.latitude,
                    'longitude': STATE.location?.coords.longitude
                }
            }])
        ) : (
            STATE.setPhotos([{
                id: STATE.photos.length + 1,
                uri: STATE.uri,
                informations: {
                    'dataHora': STATE.location?.timestamp,
                    'latitude': STATE.location?.coords.latitude,
                    'longitude': STATE.location?.coords.longitude
                }
            }])
        )
        STATE.setUri(null)
        navigation.navigate('index')
    }

    const toggleFacing = () => {
        setFacing((prev) => (prev === "back" ? "front" : "back"));
    };

    const toggleFlash = () => {
        setFlash((prev) => (prev === "off" ? "on" : "off"));
    };

    const renderPicture = () => {
        const { uri, setUri } = STATE;

        return (
            <View style={styles.pictureContainer}>
                <GetLocation />
                <Image
                    source={{ uri }}
                    contentFit="contain"
                    style={styles.image}
                />
                <Pressable onPress={() => save()} style={[styles.btn]}>
                    <AntDesign name="save" size={48} color="black" />
                    <Text style={{ color: 'black', textAlign: 'center' }}>Salvar</Text>
                </Pressable>
                <Pressable onPress={() => setUri(null)} style={[styles.btn]}>
                    <AntDesign name="picture" size={48} color="black" />
                    <Text style={{ color: 'black', textAlign: 'center' }}>Capturar outra foto</Text>
                </Pressable>
            </View>
        );
    };

    const renderCamera = () => {
        return (
            <CameraView
                style={styles.camera}
                ref={ref}
                mode={mode}
                facing={facing}
                flash={flash}
                mute={false}
                active
                responsiveOrientationWhenOrientationLocked
            >
                <View style={styles.shutterContainer}>
                    <Pressable onPress={toggleFlash}>
                        <MaterialIcons name={flash === 'on' ? 'flash-off' : 'flash-on'} size={42} color="white" />
                    </Pressable>
                    <Pressable onPress={takePicture}>
                        {({ pressed }) => (
                            <View
                                style={[
                                    styles.shutterBtn,
                                    {
                                        opacity: pressed ? 0.5 : 1,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.shutterBtnInner,
                                        {
                                            backgroundColor: "white",
                                        },
                                    ]}
                                />
                            </View>
                        )}
                    </Pressable>
                    <Pressable onPress={toggleFacing}>
                        <MaterialIcons name={facing === 'front' ? 'rotate-left' : 'rotate-right'} size={42} color="white" />
                    </Pressable>
                </View>
            </CameraView>
        );
    };

    return (
        <View style={styles.container}>
            {STATE.uri ? renderPicture() : renderCamera()}
        </View>
    );
}

const styles = StyleSheet.create({
    pictureContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: '10%',
        backgroundColor: 'black',
        borderColor: 'orange',
        borderWidth: 2

    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    camera: {
        flex: 1,
        width: "100%",
    },
    shutterContainer: {
        position: "absolute",
        bottom: 44,
        left: 0,
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30,
    },
    shutterBtn: {
        backgroundColor: "transparent",
        borderWidth: 5,
        borderColor: "white",
        width: 85,
        height: 85,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
    },
    btn: {
        width: 120,
        height: 90,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        backgroundColor: 'orange',
    },
    shutterBtnInner: {
        width: 70,
        height: 70,
        borderRadius: 50,
    },
    image: {
        width: 460,
        aspectRatio: 1,
        borderColor: 'orange',
        borderBottomWidth: 2
    }
});
