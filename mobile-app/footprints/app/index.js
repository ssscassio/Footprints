import React, { Component } from "react";
import {
    AsyncStorage,
    PermissionsAndroid,
} from 'react-native';
import { NavigationProvider, StackNavigation } from "@expo/ex-navigation";
import Router from "./router";
import BackgroundJob from "react-native-background-job";
import DeviceBattery from 'react-native-device-battery';
import User from './lib/user';

const jobKey = 'locationService';

BackgroundJob.register({
    jobKey: jobKey,
    job: () => {
        console.log('job called');
        AsyncStorage.getItem('UID').then(uid => {
            console.log(uid);
            if (uid == null) return;

            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(value => {
                if (!value) return;
                
                navigator.geolocation.getCurrentPosition(position => {
                    User.updateStatus(uid, { location: position });
                }, err => {
                    console.log(err);
                }, {
                    enableHighAccuracy: true,
                    timeout: 5000
                });
            });

            Promise.all([
                DeviceBattery.getBatteryLevel(),
                DeviceBattery.isCharging()
            ])
            .then(values => {
                let [level, charging] = values;
                User.updateStatus(uid, { battery: { level, charging } });
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
            initialPage: Router.getRoute("login"),
            loaded: false
        };
    }

    render() {
        return (
            <NavigationProvider router={Router}>
                <StackNavigation initialRoute={this.state.initialPage} />
            </NavigationProvider>
        );
    }
}

//make this component available to the App
export default Footprints;
