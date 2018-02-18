import firebase from 'react-native-firebase';

const db = firebase.firestore();
const rtdb = firebase.database();

const group = {
    getGroup(gid) {
        return db.collection('groups').doc(gid).get()
            .then(doc => {
                if (doc.exists) return Promise.resolve(Object.assign(doc.data(),{ id: doc.id } ));
                else return Promise.reject(new Error(`Group ${gid} doesn't exist.`))
            })
            .catch(err => Promise.reject(err));
    },
    createGroup(params) {
        return db.collection('groups').add(params);
    }
};

export default group;