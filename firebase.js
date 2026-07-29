const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA-4W6p77JCUKPg8lylQ_hrTVGJ0lg6vm0",
  authDomain: "amt-coding-academy.firebaseapp.com",
  projectId: "amt-coding-academy",
  storageBucket: "amt-coding-academy.firebasestorage.app",
  messagingSenderId: "515844581129",
  appId: "1:515844581129:web:99a4b03d9959c19120d5d8"
};

firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.firestore();

function saveRegistrationToFirestore(data) {
  return db.collection("registrations").add({
    fullName: data.fullName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    country: data.country,
    countryCode: data.countryCode,
    referralSource: data.referralSource || "Not specified",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}
