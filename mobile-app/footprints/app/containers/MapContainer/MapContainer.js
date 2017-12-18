import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    InteractionManager,
    Image,
    AsyncStorage
} from "react-native";
import MapView from "react-native-maps";
import Images from "../../config/images";
import Colors from "../../config/colors";
import User from '../../lib/user';
import firebase from 'react-native-firebase';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0122;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const KiLOMETERS_ON_A_DEGREE = 1 / 111;
const markWidth = 372;
const markHeight = 594;
const geolocationOptionsHigh = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0
};

class MapContainer extends Component {
    constructor(props) {
        super(props);

        const lastCoords = JSON.parse(props.lastCoords);

        this.state = {
            userLocation: {
                latitude: lastCoords ? lastCoords.latitude : 0,
                longitude: lastCoords ? lastCoords.longitude : 0
            },
            friendsLocations: {}
        };

        this.initialRegion = {
            latitude: this.state.userLocation.latitude,
            longitude: this.state.userLocation.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }

        this.user = JSON.parse(props.user);
    }

    componentDidMount() {
        console.log('MapContainer did mount');
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
            ok: "YES",
            cancel: "NO",
            enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => ONLY GPS PROVIDER
            showDialog: true, // false => Opens the Location access page directly
            openLocationServices: true, // false => Directly catch method is called if location services are turned off
            preventOutSideTouch: true, //true => To prevent the location services window from closing when it is clicked outside
            preventBackClick: true //true => To prevent the location services popup from closing when it is clicked back button
        }).then((success) => {
            console.log(success); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
            const myUID = this.user.uid;
            this._watchID = navigator.geolocation.watchPosition(
                (position) => {
                    this._setCoords(position.coords);
                    User.updateStatus(myUID, { location: position });

                    AsyncStorage.setItem('userLastLocation', JSON.stringify(position.coords));
                },
                error => console.log(error),
                geolocationOptionsHigh
            );

            User.getConfirmedFriends(myUID)
            .then(friends => {
                return Promise.all(
                    Object.keys(friends).map(fid => User.getProfile(fid))
                )
                .then(values => {
                    const res = values.reduce((acc, val) => {
                        acc[val.id] = val.profile_picture;
                        return acc;
                    }, {});
                    return Promise.resolve(res);
                });
            })
            .then(friends => {
                const ids = Object.keys(friends);
                ids.forEach(id => {
                    User.offStatus(id);
                    User.onStatus(id, (err, data) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        const copy = this.state.friendsLocations;
                        const coords = {
                            photoURL: friends[id],
                            latitude: data.location.coords.latitude,
                            longitude: data.location.coords.longitude
                        };

                        if (this.state.friendsLocations[id] == null) {
                            copy[id] = coords;
                            this.setState({ friendsLocations: copy });
                            return;
                        }
                        if (coords.latitude !== this.state.friendsLocations[id].latitude) {
                            copy[id] = coords;
                            this.setState({ friendsLocations: copy });
                            return;
                        }
                    });
                });
            })
            .catch(err => console.log(err));    
        }).catch((error) => {
            console.log(error.message); // error.message => "disabled"
        });
    }

    componentDidUpdate() {
        console.log('MapContainer did update');
    }

    componentWillUnmount() {
        console.log('MapContainer will unmount');
        navigator.geolocation.clearWatch(this._watchID);
        Object.keys(this.state.friendsLocations).forEach(fid => {
            User.offStatus(fid);
        }); 
    }

    _setCoords(coords) {
        this.setState(
            {
                userLocation: {
                    latitude: coords.latitude,
                    longitude: coords.longitude
                },
                hasLocation: true
            },
            () => {
                if (this._map != null) {
                    this._map.animateToRegion(this.initialRegion);
                }
            }
        );
    }

    _renderUsers() {
        const users = Object.keys(this.state.friendsLocations).map((fid, idx) => {
            const friendData = this.state.friendsLocations[fid];
            return (
                <MapView.Marker
                    key={`friend-${idx}`}
                    coordinate={{
                        latitude: parseFloat(friendData.latitude),
                        longitude: parseFloat(friendData.longitude)
                    }}
                    anchor={{ x: 0.5, y: 0.5 }}
                >
                    <Image
                        source={{uri: friendData.photoURL}}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            borderWidth: 2,
                            borderColor: Colors.accentColor
                        }}
                    />
            </MapView.Marker>
            );
        });

        const myPhotoUrl = this.user.photoURL;
        const myCoords = this.state.userLocation;

        // my user
        users.unshift(
            <MapView.Marker
                key={`user-${new Date().getTime()}`}
                coordinate={myCoords}
                anchor={{ x: 0.6, y: 0.6 }}
                >
                <Image
                    source={{uri: myPhotoUrl}}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: Colors.primaryColor
                    }}
                />
            </MapView.Marker> 
        );

        return users;
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={this.initialRegion}
                >
                    {this._renderUsers()}
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    }
});

//make this component available to the app
export default MapContainer;
