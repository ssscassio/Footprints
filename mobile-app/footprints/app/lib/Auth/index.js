import GoogleLogin from './GoogleLogin';
import FacebookLogin from './FacebookLogin';



class Auth {
    firebase = null;
    onLogin = null;
    onLogout = null;
    onError = null;

    setup = (firebase, googleConfig) => {
        this.firebase = firebase;

        if (googleConfig == null) googleConfig = {};
        GoogleLogin.configure(googleConfig);

        this.firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.onLogin && this.onLogin(user);
            } else {
                this.onLogout && this.onLogout();
            }
        });
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

    logout = () => {
        this.firebase.auth().signOut();
    }
}

const instance = new Auth();

export default instance;