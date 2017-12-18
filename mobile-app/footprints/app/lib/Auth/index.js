import GoogleLogin from './GoogleLogin';
import FacebookLogin from './FacebookLogin';
import { AsyncStorage } from "react-native";


class Auth {
    firebase = null;
    onLogin = null;
    onLogout = null;
    onError = null;
    unsub = null;

    setup = (firebase, googleConfig) => {
        this.firebase = firebase;

        if (googleConfig == null) googleConfig = {};
        GoogleLogin.configure(googleConfig);

        this.unsub = this.firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                AsyncStorage.setItem('userData', JSON.stringify(user.toJSON()))
                .then(() => {
                    this.onLogin && this.onLogin(user);
                })
                .catch(err => console.log(err));
            } else {
                this.onLogout && this.onLogout();
            }
        });
    }

    unsubscribe = () => {
        if (this.unsub != null) {
            this.unsub();
        }
    }

    setOnLogin = (onLogin) => {
        this.onLogin = onLogin;
    }

    setOnLogout = (onLogout) => {
        this.onLogout = onLogout;
    }

    setOnError = (onError) => {
        this.onError = onError;
    }

    facebookLogin = () => {
        FacebookLogin.login(['public_profile', 'email'])
            .then(data => {
                const credential = this.firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                return this.firebase.auth().signInWithCredential(credential);
            })
            .catch(err => {
                this.onError && this.onError(err);
            });
    }

    googleLogin = () => {
        GoogleLogin.login()
            .then(data => {
                const credential = this.firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken); 
                return this.firebase.auth().signInWithCredential(credential); 
            }).catch(err => {
                this.onError && this.onError(err);
            });
    }

    tokenLogin = (token) => {
        return this.firebase.auth().signInWithCustomToken(token)
            .catch(err => this.onError && this.onError(err));
    }

    logout = () => {
        this.firebase.auth().signOut();
    }

    getUser = () => {
        if (this.firebase.auth().currentUser != null) {
            return Promise.resolve(this.firebase.auth().currentUser);
        }
        else {
            return Promise.reject(new Error('No user signed in.'));
        }
    }
}

const instance = new Auth();

export default instance;