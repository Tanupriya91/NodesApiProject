const admin = require("firebase-admin");
const serviceAccount = require("./firebase/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase Project:", serviceAccount.project_id);

const db = admin.firestore();

module.exports = {
  admin,
  db
};