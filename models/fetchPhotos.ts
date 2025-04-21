import {collection, getDocs} from 'firebase/firestore';
import db from '../config/firebase';

const COLLECTION = 'photos';

const fetchPhotos = async (setPhotos: any) => {
  const querySnapshot = await getDocs(collection(db, COLLECTION));
  const photosList = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  setPhotos(photosList);
};

export default fetchPhotos;
