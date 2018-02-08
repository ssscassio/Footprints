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
import PushNotification from 'react-native-push-notification';
import firebase from 'react-native-firebase';
import User from './lib/user';
import Auth from './lib/Auth';

const jobKey = 'locationService';
const BATTERY_SWITCH_KEY = 'battery-switch-key';

BackgroundJob.register({
    jobKey: jobKey,
    job: () => {
        console.log('job called');
        AsyncStorage.getAllKeys().then(keys => {
            keys = keys.filter(key => key.indexOf(BATTERY_SWITCH_KEY) != -1);
            AsyncStorage.multiGet(keys).then(store => {
                store.forEach(item => {
                    let key = item[0];
                    let value = JSON.parse(item[1]);

                    const uid = value.uid;
                    const watchingBattery = value.battery;
                    const name = value.name;

                    if (watchingBattery) {
                        User.getStatus(uid).then(data => {
                            if (data.battery != null) {
                                const level = Math.floor(data.battery.level*100);
                                const charging = data.battery.charging;

                                if (level < 120) {
                                    PushNotification.localNotification({
                                        playSound: false,
                                        title: `Alerta sobre ${name}`,
                                        bigText: `${name} está com ${level}% de bateria e ${charging?"carregando":"descarregando"}.`,
                                        message: `${name} está com ${level}% de bateria.`
                                    });
                                }
                            }
                        }).catch(err => console.log(err));
                    }
                });
            });
        });

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

PushNotification.configure({
    onNotification: function(notification) {
        console.log(notification);
    }
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
