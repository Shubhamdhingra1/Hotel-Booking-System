import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD93YcSwcR8UHqi6xuNFzeHSyjoWC2puc8",
    authDomain: "hotelbook-b6654.firebaseapp.com",
    projectId: "hotelbook-b6654",
    storageBucket: "hotelbook-b6654.appspot.com",
    messagingSenderId: "895726606639",
    appId: "1:895726606639:web:2bc79947034c57e84b69da",
    measurementId: "G-5W61FVWB22"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };