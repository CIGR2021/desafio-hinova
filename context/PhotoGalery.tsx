import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import * as Location from 'expo-location';
import { getPhotos } from "@/fakeAPI/database";
import fetchPhotos from "@/models/fetchPhotos";

type PhotoGaleryProviderProps = {
	children: ReactNode,
};

type PhotoGaleryType = {
	uri: string | null,
    setUri: Dispatch<SetStateAction<string | null>>,
    location: Location.LocationObject | null,
    setLocation: Dispatch<SetStateAction<Location.LocationObject | null>>
    errorMsg: string | null,
    setErrorMsg: Dispatch<SetStateAction<string | null>>,
    photos: any,
    setPhotos: Dispatch<SetStateAction<any>>,
    selected: any,
    setSelected: Dispatch<SetStateAction<any>>
    lat: any,
    setLat: Dispatch<SetStateAction<any>>,
    lng: any,
    setLng: Dispatch<SetStateAction<any>>,
    dateTime: any,
    setDateTime: Dispatch<SetStateAction<any>>,
};

export const PhotoGaleryContext = createContext({} as PhotoGaleryType);

export const PhotoGaleryProvider = ({children}: PhotoGaleryProviderProps) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [uri, setUri] = useState<string | null>(null);
    const [photos, setPhotos] = useState([])
    const [selected, setSelected] = useState(null)
    const [lat, setLat] = useState<any>(null);
    const [lng, setLng] = useState<any>(null);
    const [dateTime, setDateTime] = useState<any>(null);

    return (
        <PhotoGaleryContext.Provider
            value={{
                uri,
                setUri,
                location,
                setLocation,
                errorMsg,
                setErrorMsg,
                photos,
                setPhotos,
                selected,
                setSelected,
                lat,
                setLat,
                lng,
                setLng,
                dateTime,
                setDateTime
            }}
        >
            {children}
        </PhotoGaleryContext.Provider>
    )
}

export const usePhotoGalery = () => useContext(PhotoGaleryContext);