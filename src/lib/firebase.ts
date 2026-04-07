import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBb2cEfe_nwx6kDTI-KHPjpkxGA8NNJ_uQ",
  authDomain: "leorent.firebaseapp.com",
  projectId: "leorent",
  storageBucket: "leorent.firebasestorage.app",
  messagingSenderId: "807523905992",
  appId: "1:807523905992:web:ff28ed11e5a9adcafa50fd",
  measurementId: "G-EHKQVVSN8J",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

if (typeof window !== "undefined") {
  void isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}
