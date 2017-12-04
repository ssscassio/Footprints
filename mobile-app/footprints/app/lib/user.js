import firebase from 'react-native-firebase';

const db = firebase.firestore();

const user = {

    saveProfile: (uid, name, email, profile_picture) => {
        return db.collection('users').doc(uid).update({
            name,
            email,
            profile_picture
        });
    }
}

export default user;