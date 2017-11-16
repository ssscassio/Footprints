import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import TabViewFooter from "../../components/TabViewFooter";
import Icon from 'react-native-vector-icons/FontAwesome';
import FireAuth from 'react-native-firebase-auth';
import Router from "../../router";
import Images from "../../config/images";

class LoginScreen extends Component {

    constructor(props) {
        super(props);
        FireAuth.init({
            clientID: '855974838992-5m2b3iebidgrg7lnc7pfj3ourvuddtpj.apps.googleusercontent.com',
            scopes: ['openid', 'email', 'profile'],
            shouldFetchBasicProfile: true
        });
    }

    popScreen() {
        this.props.navigator.pop();
    }

    pushScreen(screen, props) {
        this.props.navigator.push(Router.getRoute(screen, props));
    }

    onLogin = (user, val) => {
        console.log(val);
        console.log(user);
        this.pushScreen('home');
    }
    
    onUserChange() {
        console.log('user change');
    }

    onLogout = () => {
        console.log('did log out');
        this.props.navigator.popToTop();
    }

    onEmailVerified() {
        console.log('email verified');
    }

    onError(err) {
        console.log('error');
        console.log(err);
    }

    componentDidMount() {
        FireAuth.setup(this.onLogin, this.onUserChange, this.onLogout, this.onEmailVerified, this.onError);
    }

    loginWithFacebook() {
        FireAuth.facebookLogin(['email', 'user_friends']);
    }
    
    loginWithGoogle() {
        FireAuth.googleLogin();
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2c3e50"
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
        width: 200,
        height: 40
    }
});

//make this component available to the app
export default LoginScreen;
