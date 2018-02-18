import React, { Component } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    ActivityIndicator,
    AsyncStorage,
    InteractionManager
} from "react-native";
import TabViewFooter from "../../components/TabViewFooter";
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';
import Router from "../../router";
import Images from "../../config/images";
import User from '../../lib/user';
import Auth from '../../lib/Auth';

class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };

        this.onLogin = this.onLogin.bind(this)
        this.loginWithFacebook = this.loginWithFacebook.bind(this)
        this.loginWithGoogle = this.loginWithGoogle.bind(this)
    }

    onLogin = (user) => {
        let userCopy = {};
        if (user.providerData != null ) {
            userCopy.photoURL = user.providerData[0].photoURL;
        }
        else userCopy.photoURL = user.photoURL;

        userCopy.displayName = user.displayName;
        userCopy.email = user.email;
        userCopy.uid = user.uid;

        console.log(user.providerData);
        console.log(userCopy.photoURL);
        console.log(userCopy.displayName);
        console.log(userCopy.email);
        console.log(userCopy.uid);
        
        User.getProfile(userCopy.uid)
            .then(() => {
                User.updateProfile(userCopy.uid, { profile_picture: userCopy.photoURL })
                    .then(() => {
                        this.props.navigator.replace(Router.getRoute('home', { user: JSON.stringify(userCopy) }));
                    })
                    .catch(err => {
                        this.setState({ loading: false });
                        console.log(err);
                    })
                        // this.props.navigator.replace(Router.getRoute('home', { user: JSON.stringify(user) }));
            })
            .catch(err => {
                // create new user if it doesn't exist
                User.newProfile(userCopy.uid, userCopy.displayName, userCopy.email, useCopy.photoURL)
                    .then(() => {
                        this.props.navigator.replace(Router.getRoute('home', { user: JSON.stringify(userCopy) }));
                    })
                    .catch(err => {
                        this.setState({ loading: false });
                        console.log(err)
                    });
            });
    }

    onError(err) {
        console.log('error');
        console.log(err);
    }

    componentDidMount() {
        Auth.setOnLogin(this.onLogin);
        Auth.setOnError(this.onError);
    }

    componentWillUnmount() {
    }

    loginWithFacebook() {
        this.setState({ loading: true });
        Auth.facebookLogin();
    }
    
    loginWithGoogle() {
        this.setState({ loading: true });
        Auth.googleLogin();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Image
                        style={{width: 300, height: 150}}
                        source={Images.logo}
                    />
                </View>
                <View style={styles.loginBtns}>
                    <View style={styles.btn}>
                        <Icon.Button style={styles.iconBtn} name="facebook" backgroundColor="#3b5998" onPress={this.loginWithFacebook}>
                            Login with Facebook
                        </Icon.Button>
                    </View>
                    <View style={styles.btn}>
                        <Icon.Button style={styles.iconBtn} name="google" backgroundColor="#dd4b39" onPress={this.loginWithGoogle}>
                            Login with Google
                        </Icon.Button>
                    </View>
                </View>
                {this.state.loading &&
                    <View style={styles.loading}>
                        <ActivityIndicator 
                            size='large' 
                            color='blue'
                        />
                    </View>
                }
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    },
    logo: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginBtns: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        margin: 10
    },
    iconBtn:{
        width: 190,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5FCFF88'
    }
});

//make this component available to the app
export default LoginScreen;
