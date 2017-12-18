import React, { Component } from "react";
import {
    AsyncStorage,
    PermissionsAndroid,
    ActivityIndicator,
    StyleSheet,
    View,
    InteractionManager
} from 'react-native';
import { NavigationProvider, StackNavigation } from "@expo/ex-navigation";
import Router from "./router";
import BackgroundJob from "react-native-background-job";
import DeviceBattery from 'react-native-device-battery';
import firebase from 'react-native-firebase';
import User from './lib/user';
import Auth from './lib/Auth';

const jobKey = 'locationService';

BackgroundJob.register({
    jobKey: jobKey,
    job: () => {
        console.log('job called');
        AsyncStorage.getItem('userData').then(userData => {
            if (userData == null) return;
            const user = JSON.parse(userData);

            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(value => {
                if (!value) return;
                
                navigator.geolocation.getCurrentPosition(position => {
                    User.updateStatus(user.uid, { location: position });
                    AsyncStorage.setItem('userLastLocation', JSON.stringify(position.coords));
                }, err => {
                    console.log(err);
                }, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            });

            Promise.all([
                DeviceBattery.getBatteryLevel(),
                DeviceBattery.isCharging()
            ])
            .then(values => {
                let [level, charging] = values;
                User.updateStatus(user.uid, { battery: { level, charging } });
            })
            .catch(err => console.log(err));
        });
    }
});

BackgroundJob.schedule({
    jobKey: jobKey,
    override: true,
    allowExecutionInForeground: true,
    timeout: 60*1000
});

class Footprints extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            initialPage: null,
            loaded: false
        };
    }

    onLogin = (user) => {
        AsyncStorage.getItem('userLastLocation')
        .then((coords) => {
            this.setState({ initialPage: Router.getRoute('home', { lastCoords: coords, user: JSON.stringify(user) }) });
        });
    }

    onLogout = () => {
        this.setState({ initialPage: Router.getRoute('login') });
    }

    componentWillMount() {
        console.log('index will mount');
        Auth.unsubscribe();
    }

    componentDidMount() {
        console.log('index did mount');
        Auth.setOnError((err) => console.log(err));
        Auth.setOnLogin(this.onLogin);
        Auth.setOnLogout(this.onLogout);
        Auth.setup(firebase);
    }

    render() {
        if (this.state.initialPage) {
            return (
                <NavigationProvider router={Router}>
                    <StackNavigation initialRoute={this.state.initialPage} />
                </NavigationProvider>
            );
        }
        else {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator 
                        size='large' 
                        color='blue'
                    />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
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


//make this component available to the App
export default Footprints;
