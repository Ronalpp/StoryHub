import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDdtiRTTLmgQzLra94FBvG7wARmXHbd4yM',
  authDomain: 'wallpad-5f470.firebaseapp.com',
  projectId: 'wallpad-5f470',
  storageBucket: 'wallpad-5f470.appspot.com',
  messagingSenderId: '22551881281',
  appId: '1:22551881281:web:112f7d4662590bcb0488c0',
  measurementId: 'G-C703QVF64V',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
