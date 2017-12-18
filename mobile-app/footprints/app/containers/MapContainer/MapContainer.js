import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    InteractionManager,
    Image,
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
const geolocationOptions = {
    enableHighAccuracy: false,
    timeout: 20000
};
const geolocationOptionsHigh = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0
};

class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLocation: {
                latitude: 37.78825,
                longitude: -122.4324
            },
            friendsLocations: {}
        };
        this.animateTo = this.animateTo.bind(this);
    }

    get initialRegion() {
        if (this.state.hasLocation) {
            const { userLocation } = this.state;
            return {
                latitude: userLocation.latitude || null,
                longitude: userLocation.longitude || null,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            };
        }
        return null;
    }

    animateTo(coords) {
        if (this._map != null) {
            this._map.animateToRegion(coords);
        }
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
            const myUID = firebase.auth().currentUser.uid;
            this._watchID = navigator.geolocation.watchPosition(
                (position) => {
                    this._setCoords(position.coords);
                    if (firebase.auth().currentUser != null) {
                        User.updateStatus(firebase.auth().currentUser.uid, { location: position });
                    }
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
                userLocation: coords,
                hasLocation: true
            }
        );
    }

    _renderUserMarker() {
        let { latitude, longitude } = this.state.userLocation;

        return (
            <MapView.Marker
                key={"user"}
                coordinate={{
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                }}
                anchor={{ x: 0.5, y: 0.5 }}
            >
                { firebase.auth().currentUser != null &&
                    <Image
                        source={{uri: firebase.auth().currentUser.photoURL}}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            borderWidth: 2,
                            borderColor: Colors.primaryColor
                        }}
                    />
                }
            </MapView.Marker>
        );
    }

    _renderFriendsMarkers() {
        return Object.keys(this.state.friendsLocations).map((fid, idx) => {
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
                    { friendData.photoURL != null &&
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
                    }
                </MapView.Marker>
            );
        });
    }
    render() {
        let { userLocation } = this.state;

        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    ref={c => (this._map = c)}
                    initialRegion={this.initialRegion}
                >
                    {this._renderUserMarker()}
                    {this._renderFriendsMarkers()}
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
