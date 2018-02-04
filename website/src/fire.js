import firebase from 'firebase'
var config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
  apiKey: "AIzaSyD8mu7TkYracAJHaN6JMUVrcAs7NTqv9n0",
  authDomain: "footprints-fb.firebaseapp.com",
  databaseURL: "https://footprints-fb.firebaseio.com",
  storageBucket: "footprints-fb.appspot.com"
};
const fire = firebase.initializeApp(config);
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
export const auth = firebase.auth();
export const db = firebase.database();
export default fire;