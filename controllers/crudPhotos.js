import { addDoc, collection, deleteDoc, doc, GeoPoint, updateDoc } from "firebase/firestore";
import db from "../config/firebase";
import fetchPhotos from "@/models/fetchPhotos";

const COLLECTION = 'photos';

const addPhoto = async ({
  uri,
  lat,
  lng,
  dateTime,
  setPhotos
}) => {
  if (uri && dateTime && lat && lng) {
    await addDoc(collection(db, COLLECTION), {uri, lat, lng, dateTime});
    fetchPhotos(setPhotos);
  }
};

const deletePhoto = async ({id = '', setPhotos}) => {
  await deleteDoc(doc(db, COLLECTION, id));
  fetchPhotos(setPhotos);
};

const updatePhoto = async ({id = '', uri, lat, lng, dateTime, setPhotos}) => {
  await updateDoc(doc(db, COLLECTION, id), {uri, lat, lng, dateTime});
  fetchPhotos(setPhotos);
};

const usePhotos = {
    addPhoto: addPhoto,
    deletePhoto: deletePhoto,
    updatePhoto: updatePhoto
};

export default usePhotos;
