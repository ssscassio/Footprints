import { GoogleSignin } from 'react-native-google-signin';


const GoogleLogin = {
    configure: (options) => {
        GoogleSignin.configure(options);
    },

    login: () => {
        return new Promise((resolve, reject) => {
            GoogleSignin.signIn()
                .then(resolve)
                .catch(reject);
        });
    },

    logout: () => {
        return new Promise((resolve, reject) => {
            GoogleSignin.signOut()
                .then(resolve)
                .catch(reject);
        });
    }
};

export default GoogleLogin;