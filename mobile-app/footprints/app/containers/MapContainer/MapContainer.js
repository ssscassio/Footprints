import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    InteractionManager,
    Image,
    AsyncStorage,
    TouchableOpacity,
    Animated,
    ScrollView
} from "react-native";
import MapView from "react-native-maps";
import Images from "../../config/images";
import Colors from "../../config/colors";
import UserMarker from '../../components/UserMarker';
import User from '../../lib/user';
import Group from '../../lib/group';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import DeviceBattery from 'react-native-device-battery';
import Icon from 'react-native-vector-icons/Ionicons';

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

        const lastCoords = props.lastCoords ? JSON.parse(props.lastCoords) : {latitude: 0, longitude: 0};

        this.user = JSON.parse(props.user);
        this.markers = {};

        this.state = {
            userLocation: {
                latitude: lastCoords.latitude,
                longitude: lastCoords.longitude
            },
            friends: {},
            myBattery: null,
            viewY: new Animated.Value(0),
            showingGroupPeople: false,
            currentGroup: 0,
            groups: [{
                id: '0',
                name: 'Eu',
                owner: this.user.uid,
                participants: {
                    [this.user.uid]: true
                }
            }]
        };

        this.initialRegion = {
            latitude: lastCoords.latitude,
            longitude: lastCoords.longitude,
            latitudeDelta: props.lastCoords ? LATITUDE_DELTA : 150,
            longitudeDelta: props.lastCoords ? LONGITUDE_DELTA : 150
        }

    }

    componentDidMount() {
        const myUID = this.user.uid;
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
            this._watchID = navigator.geolocation.watchPosition(
                (position) => {
                    this._setCoords(position.coords);

                    Promise.all([
                        DeviceBattery.getBatteryLevel(),
                        DeviceBattery.isCharging()
                    ])
                    .then(values => {
                        let [level, charging] = values;
                        User.updateStatus(myUID, { battery: { level, charging } });
                    })
                    .catch(err => console.log(err));

                    User.updateStatus(myUID, { location: position });

                    AsyncStorage.setItem('userLastLocation', JSON.stringify(position.coords));
                },
                err => console.log(err),
                geolocationOptionsHigh
            );

            User.getStatus(myUID)
            .then(myStatus => {
                this.setState({ myBattery: myStatus.battery ? myStatus.battery : null });
            })
            .catch(err => console.log(err));

            User.getConfirmedFriends(myUID)
            .then(friends => {
                return Promise.all(
                    Object.keys(friends).map(fid => User.getProfile(fid))
                )
                .then(values => {
                    const res = values.reduce((acc, val) => {
                        acc[val.id] = { photoURL: val.profile_picture, name: val.name };
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
                        if (data == null) data = {};

                        const copy = this.state.friends;
                        const coords = {
                            battery: data.battery ? data.battery : null,
                            id: id,
                            name: friends[id].name.split(' ')[0],
                            photoURL: friends[id].photoURL,
                            latitude: data.location ? data.location.coords.latitude : 0,
                            longitude: data.location ? data.location.coords.longitude : 0
                        };

                        if (this.state.friends[id] == null || coords.latitude !== this.state.friends[id].latitude) {
                            copy[id] = coords;
                            this.setState({ friends: copy });
                            this._focusMap();
                            return;
                        }
                    });
                });
            })
            .catch(err => console.log(err));   
            
            //setTimeout(() => this._focusMap(), 3000);
        }).catch((error) => {
            console.log(error.message); // error.message => "disabled"
        });

        User.getGroups(myUID)
        .then(groups => {
            const res = Object.keys(groups).map(gid => Group.getGroup(gid));
            return Promise.all(res);
        })
        .then(groups => {
            const newList = this.state.groups.concat(groups);
            this.setState({ groups: newList });
        })
        .catch(err => console.log(err));
        
    }

    componentDidUpdate() {
        console.log('MapContainer did update');
    }

    componentWillUnmount() {
        console.log('MapContainer will unmount');
        navigator.geolocation.clearWatch(this._watchID);
        Object.keys(this.state.friends).forEach(fid => {
            User.offStatus(fid);
        }); 
    }

    _focusMap(markerIds) {
        if (markerIds == null) {
            markerIds = Object.keys(this.state.friends);
            markerIds.unshift(this.user.id);
        }

        this._map.fitToSuppliedMarkers(markerIds, true);
    }

    _setCoords(coords) {
        this.setState(
            {
                userLocation: {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                },
                hasLocation: true
            }, this._focusMap);
    }

    _renderUsers() {
        const users = Object.keys(this.state.groups[this.state.currentGroup].participants)
        .filter(uid => uid !== this.user.uid && this.state.friends[uid] != null)
        .map((fid, idx) => {
            const friendData = this.state.friends[fid];
            return (
                <UserMarker 
                    ref={ref => { this.markers[fid] = ref }}
                    key={`friend-${idx}`} 
                    user={friendData} 
                    isCurrentUser={false} />  
            );
        });

        const currentUser = {
            id: this.user.uid,
            name: this.user.displayName.split(' ')[0],
            photoURL: this.user.photoURL,
            latitude: this.state.userLocation.latitude,
            longitude: this.state.userLocation.longitude,
            battery: this.state.myBattery
        }

        // my user
        users.unshift(
            <UserMarker 
                ref={ref => { this.markers[currentUser.id] = ref }}
                key={`user-${new Date().getTime()}`} 
                user={currentUser} 
                isCurrentUser={true} />
        );

        return users;
    }

    _showFriendsList = () => {
        this.setState({ showingGroupPeople: true })
        Animated.timing(this.state.viewY, {
            toValue: 70,
            duration: 600,
        }).start();
    }

    _hideFriendsList = () => {
        this.setState({ showingGroupPeople: false })
        Animated.timing(this.state.viewY, {
            toValue: 0,
            duration: 600
        }).start();
    }

    _renderGroupName = () => {
        let groupName = this.state.groups[this.state.currentGroup].name;
        return (<Text style={styles.groupName}>{groupName}</Text>);
    }

    _nextGroup = () => {
        this.setState({ currentGroup: (this.state.currentGroup+1)%this.state.groups.length });
    }

    _previousGroup = () => {
        let res;
        if (this.state.currentGroup === 0) res = this.state.groups.length-1;
        else res = this.state.currentGroup-1;
        this.setState({ currentGroup: res });
    }

    _goToUser = (user) => {
        this._focusMap([user.id]);
        this.markers[user.id].showCallout();
    }

    _renderGroupMembers = () => {
        const group = this.state.groups[this.state.currentGroup];
        let ids = [];

        const items = Object.keys(group.participants)
        .filter(uid => uid === this.user.uid || this.state.friends[uid] != null)
        .map(uid => {
            let user = uid === this.user.uid ? this.user : this.state.friends[uid];
            if (user.name == null) user.name = user.displayName.split(' ')[0];
            if (user.id == null) user.id = user.uid;

            ids.push(user.id);
            return (
                <TouchableOpacity 
                    key={user.id} 
                    style={{
                        height: 60,
                        width: 60,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onPress={() => this._goToUser(user)}>
                    <Image style={{width: 36, height: 36, borderRadius: 18}} source={{uri: user.photoURL}}/>
                    <Text style={{fontSize: 14}}>{user.name}</Text>
                </TouchableOpacity> 
            );
        });

        items.unshift(
            <TouchableOpacity 
                key={new Date().getTime()} 
                style={{
                    height: 60,
                    width: 60,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                onPress={() => this._focusMap(ids)}>
                <Icon color={Colors.primaryColor} size={40} style={{width: 36, height: 36, borderRadius: 18}} name="md-people"/>
                <Text style={{fontSize: 14}}>Todos</Text>
            </TouchableOpacity>  
        );

        return items;
    } 

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.groupChooser}>
                    <TouchableOpacity onPress={this._previousGroup}>
                        <Icon name="ios-arrow-back" size={32} color={Colors.lightPrimaryColor}/>
                    </TouchableOpacity>
                    <View>
                        <TouchableOpacity 
                            style={{ 
                                paddingTop: 20, 
                                paddingBottom: 10,
                                flexDirection: 'column', 
                                justifyContent: 'center', 
                                alignItems: 'center'}}
                            onPress={!this.state.showingGroupPeople ? ()=>this._showFriendsList() : ()=>this._hideFriendsList()}
                        >
                        {this._renderGroupName()}
                        { !this.state.showingGroupPeople && 
                            <Icon name="ios-arrow-down" size={28} color={Colors.lightPrimaryColor}/>
                        }
                        { this.state.showingGroupPeople && 
                            <Icon name="ios-arrow-up" size={28} color={Colors.lightPrimaryColor}/>
                        }
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={this._nextGroup}>
                        <Icon name="ios-arrow-forward" size={32} color={Colors.lightPrimaryColor}/> 
                    </TouchableOpacity>
                </View>
                <Animated.View style={{ 
                    height: this.state.viewY, 
                    borderBottomWidth: StyleSheet.hairlineWidth,

                    }}>
                    <ScrollView style={{padding: 5}} horizontal={true}>
                        {this._renderGroupMembers()}
                    </ScrollView>
                </Animated.View>
                <View style={styles.mapContainer}>
                    <MapView
                        ref={ref => { this._map = ref }}
                        style={styles.map}
                        initialRegion={this.initialRegion}
                    >
                        {this._renderUsers()}
                    </MapView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    mapContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    groupChooser: {
        height: 70,
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingRight: 15,
        paddingLeft: 15,
    },
    groupName: {
        color: Colors.primaryColor,
        fontSize: 32
    },

});

//make this component available to the app
export default MapContainer;
