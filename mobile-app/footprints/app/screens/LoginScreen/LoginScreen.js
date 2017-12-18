import React, { Component } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    ActivityIndicator,
    AsyncStorage
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

        Auth.setup(firebase);

        this.onLogin = this.onLogin.bind(this)
        this.loginWithFacebook = this.loginWithFacebook.bind(this)
        this.loginWithGoogle = this.loginWithGoogle.bind(this)
    }

    onLogin = (user) => {
        console.log(user.photoURL);
        console.log(user.displayName);
        console.log(user.email);
        console.log(user.uid);
        
        User.getProfile(user.uid)
            .then(() => {
                AsyncStorage.setItem('UID', user.uid).then(() => {
                    this.setState({ loading: false });
                    this.props.navigator.push(Router.getRoute('home'));
                });
            })
            .catch(err => {
                // create new user if it doesn't exist
                User.newProfile(user.uid, user.displayName, user.email, user.photoURL)
                    .then(() => {
                        AsyncStorage.setItem('UID', user.uid).then(() => {
                            this.setState({ loading: false });
                            this.props.navigator.push(Router.getRoute('home'));
                        });
                    })
                    .catch(err => console.log(err));
            });
    }

    onError(err) {
        console.log('error');
        console.log(err);
    }

    componentDidMount() {
        Auth.setOnLogin(this.onLogin);
        Auth.setOnError(this.onError);

        this.setState({ loading: true });
        setInterval(() => {
            this.setState({ loading: false });
        }, 5000);
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
