import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDafdFhJnPk2Wr1fRtTbA4sm5gAJR-_zAw',
  authDomain: 'backend-learning-c5178.firebaseapp.com',
  projectId: 'backend-learning-c5178',
  storageBucket: 'backend-learning-c5178.firebasestorage.app',
  messagingSenderId: '140361010440',
  appId: '1:140361010440:web:aba70dc6e46a93558df0bd',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
