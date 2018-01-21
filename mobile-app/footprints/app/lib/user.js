import firebase from 'react-native-firebase';

const db = firebase.firestore();
const rtdb = firebase.database();

const FieldValue = firebase.FieldValue;

const user = {

    getProfile(uid) {
        return db.collection('users').doc(uid).get()
            .then(doc => {
                if (doc.exists) return Promise.resolve(Object.assign(doc.data(),{ id: doc.id } ));
                else return Promise.reject(new Error(`User ${uid} doesn't exist.`))
            })
            .catch(err => Promise.reject(err));
    },

    saveProfile(uid, name, email, profile_picture, friends) {
        return db.collection('users').doc(uid).update({
            name,
            email,
            profile_picture,
            friends
        });
    },

    newProfile(uid, name, email, profile_picture) {
        return db.collection('users').doc(uid).set({
            name,
            email,
            profile_picture,
            friends: {}
        }); 
    },

    updateProfile(uid, params) {
        return db.collection('users').doc(uid).update(params); 
    },

    deleteProfile(uid) {
        return db.collection('users').doc(uid).delete();
    },

    addFriend(uid, fid) {
        const friend = `friends.${fid}`;
        const user = `friends.${uid}`;
        return Promise.all([
            this.updateProfile(uid, { [friend]: {
                accepted: true, 
                pending: true 
            } } ),
            this.updateProfile(fid, { [user]: {
                accepted: false, 
                pending: true 
            } } )
        ]); 
    },

    confirmFriend(uid, fid) {
        const friend = `friends.${fid}`;
        const user = `friends.${uid}`;
        return Promise.all([
            this.updateProfile(uid, { [friend]: {
                accepted: true, 
                pending: false 
            } } ),
            this.updateProfile(fid, { [user]: {
                accepted: true, 
                pending: false 
            } } )
        ]); 
    },

    rejectFriend(uid, fid) {
        const friend = `friends.${fid}`;
        const user = `friends.${uid}`;
        return Promise.all([
            this.updateProfile(uid, { [friend]: FieldValue.delete() } ),
            this.updateProfile(fid, { [user]:  FieldValue.delete() } )
        ]); 
    },

    getFriends(uid) {
        return db.collection('users').doc(uid).get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data();

                    if (data.friends == null)
                        return this.updateProfile(uid, { friends: {} })
                            .then(() => Promise.resolve({}))
                            .catch(err => Promise.reject(err));

                    return Promise.resolve(data.friends);
                }
                else 
                    return Promise.reject(new Error(`User ${uid} doesn't exist.`));
            })
            .catch(err => Promise.reject(err));
    },

    getConfirmedFriends(uid) {
        return this.getFriends(uid)
            .then(friends => {
                const confirmedFriends = Object.keys(friends).reduce((acc, fid) => {
                    if (!friends[fid].pending)
                        acc[fid] = friends[fid];
                    return acc;
                }, {});

                return Promise.resolve(confirmedFriends);
            })
            .catch(err => Promise.reject(err));
    },

    getPendingFriends(uid) {
        return this.getFriends(uid)
            .then(friends => {
                const confirmedFriends = Object.keys(friends).reduce((acc, fid) => {
                    if (friends[fid].pending)
                        acc[fid] = friends[fid];
                    return acc;
                }, {});

                return Promise.resolve(confirmedFriends);
            })
            .catch(err => Promise.reject(err)); 
    },

    updateStatus(uid, params) {
        return rtdb.ref(`users/${uid}`).update(params);
    },

    getStatus(fid) {
        return rtdb.ref(`users/${fid}`).once('value').then(snapshot => {
            const data = snapshot.val();
            return Promise.resolve(data);
        }).catch(err => Promise.reject(err));
    },

    onStatus(fid, cb) {
        return rtdb.ref(`users/${fid}`).on('value', 
        snapshot => {
            const data = snapshot.val();
            return cb(null, data);
        },
        err => cb(err)); 
    },

    offStatus(fid) {
        return rtdb.ref(`users/${fid}`).off('value');
    },

    joinGroup(uid, gid) {
        const group = `groups.${gid}`
        return this.updateProfile(uid, { [group]: true });
    },

    getGroups(uid) {
        return db.collection('users').doc(uid).get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data();

                    if (data.groups == null)
                        return this.updateProfile(uid, { groups: {} })
                            .then(() => Promise.resolve({}))
                            .catch(err => Promise.reject(err));

                    return Promise.resolve(data.groups);
                }
                else 
                    return Promise.reject(new Error(`User ${uid} doesn't exist.`));
            })
            .catch(err => Promise.reject(err)); 
    }
}

export default user;