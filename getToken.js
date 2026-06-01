const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const fs = require("fs");

const firebaseConfig = {
  apiKey: "AIzaSyDafdFhJnPk2Wr1fRtTbA4sm5gAJR-_zAw",
  authDomain: "backend-learning-c5178.firebaseapp.com",
  projectId: "backend-learning-c5178",
  storageBucket: "backend-learning-c5178.firebasestorage.app",
  messagingSenderId: "140361010440",
  appId: "1:140361010440:web:aba70dc6e46a93558df0bd",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function getToken() {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      "backendtest@example.com",
      "Test123456",
    );

    const token = await userCredential.user.getIdToken(true);

    fs.writeFileSync("token.txt", token);

    console.log("Token saved to token.txt");
  } catch (error) {
    console.error(error);
  }
}

getToken();
