// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD9Htdwtwg1DZ748Vw2Os7rUGe4WrdQl20',
  authDomain: 'cards-e483e.firebaseapp.com',
  projectId: 'cards-e483e',
  storageBucket: 'cards-e483e.firebasestorage.app',
  messagingSenderId: '561222295117',
  appId: '1:561222295117:web:3bae24166bedcfdee04604',
  measurementId: 'G-P4Q4TPFMRR',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

const db = getFirestore(app)
export { db }
export const auth = getAuth(app)
