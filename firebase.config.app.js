import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {getStorage} from 'firebase/storage'

const firebaseConfigApp = {
    apiKey: "AIzaSyCHpkTbVZiYX1u8C0uJKuVlNmlEY4ImOoU",
    authDomain: "kan-video-2a4e7.firebaseapp.com",
    projectId: "kan-video-2a4e7",
    storageBucket: "kan-video-2a4e7.appspot.com",
    messagingSenderId: "168017803749",
    appId: "1:168017803749:web:9ec654b67d42f8a285d70c",
    measurementId: "G-0VZWCXHZFL"
}
const app = initializeApp(firebaseConfigApp)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
