// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6VLjBLDwTZb5qhYX5bLSNmzc1fyVUsZ0",
  authDomain: "promptrank.firebaseapp.com",
  projectId: "promptrank",
  storageBucket: "promptrank.firebasestorage.app",
  messagingSenderId: "493786330342",
  appId: "1:493786330342:web:f6814598de7623f6f0b727",
  measurementId: "G-0J01ZDZV6J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
