import React, { Component } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    ActivityIndicator 
} from "react-native";
import TabViewFooter from "../../components/TabViewFooter";
import Icon from 'react-native-vector-icons/FontAwesome';
import FireAuth from 'react-native-firebase-auth';
import Router from "../../router";
import Images from "../../config/images";

class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
        FireAuth.init({
            clientID: '855974838992-5m2b3iebidgrg7lnc7pfj3ourvuddtpj.apps.googleusercontent.com',
            scopes: ['openid', 'email', 'profile'],
            shouldFetchBasicProfile: true
        });
        this.onLogin = this.onLogin.bind(this)
        this.onLogout = this.onLogout.bind(this)
        this.loginWithFacebook = this.loginWithFacebook.bind(this)
        this.loginWithGoogle = this.loginWithGoogle.bind(this)
    }

    popScreen() {
        this.props.navigator.pop();
    }

    pushScreen(screen, props) {
        this.props.navigator.push(Router.getRoute(screen, props));
    }

    onLogin = (user, val) => {
        //console.log(val);
        //console.log(user);
        console.log(user.photoURL);
        console.log(user.displayName);
        console.log(user.email);
        console.log(user.uid);

        this.setState({ loading: false });
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
        this.setState({ loading: true });
        setInterval(() => {
            this.setState({ loading: false });
        }, 5000);
    }

    loginWithFacebook() {
        this.setState({ loading: true });
        FireAuth.facebookLogin(['email', 'user_friends']);
    }
    
    loginWithGoogle() {
        this.setState({ loading: true });
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
        backgroundColor: "#f1f1f1"
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
