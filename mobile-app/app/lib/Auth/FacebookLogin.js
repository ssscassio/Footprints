import { AccessToken, LoginManager } from 'react-native-fbsdk';

const FacebookLogin = {
    login: (permissions) => {
        return new Promise((resolve, reject) => {
            LoginManager
                .logInWithReadPermissions(permissions)
                .then((result) => {
                    if (result.isCancelled) {
                        return reject(new Error('The user cancelled the request'));
                    }

                    return resolve(AccessToken.getCurrentAccessToken());
                });
        });
    },

    logout: () => {
        return new Promise((resolve) => {
            LoginManager.logOut();
            return resolve();
        });
    }
};

export default FacebookLogin;