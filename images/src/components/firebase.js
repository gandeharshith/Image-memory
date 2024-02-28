import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'; // Add import for storage

const firebaseConfig = {
  apiKey: "AIzaSyBuyDLP6aLU1uKRArjjAH2HZzaWd_Bqp1U",
  authDomain: "loginpage-a8bb1.firebaseapp.com",
  databaseURL: "https://loginpage-a8bb1-default-rtdb.firebaseio.com",
  projectId: "loginpage-a8bb1",
  storageBucket: "loginpage-a8bb1.appspot.com",
  messagingSenderId: "169111081086",
  appId: "1:169111081086:web:c3bafe563da10143b0082f"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

const sendEmailVerification = () => {
  const user = auth.currentUser;
  if (user) {
      user.sendEmailVerification()
          .then(() => {
              console.log('Email verification sent');
          })
          .catch((error) => {
              console.error('Error sending email verification:', error);
          });
  } else {
      console.error('No user signed in');
  }
};

export { auth, firestore, storage, sendEmailVerification, firebase as default };  