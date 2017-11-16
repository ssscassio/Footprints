import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    InteractionManager,
    Image
} from "react-native";
import MapView from "react-native-maps";
import Images from "../../config/images";

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
    timeout: 20000
};

class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLocation: {
                latitude: 37.78825,
                longitude: -122.4324
            }
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
        this._map.animateToRegion(coords);
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => this._setCoords(coords),
            error => console.log(error),
            geolocationOptionsHigh
        );
    }

    _setCoords(coords) {
        this.setState(
            {
                userLocation: coords,
                hasLocation: true
            },
            () => {
                InteractionManager.runAfterInteractions(() => {
                    this._map.animateToRegion(this.initialRegion);
                });
            }
        );
    }

    _renderUserMarker() {
        let { latitude, longitude } = this.state.userLocation;
        let size = 20;

        return (
            <MapView.Marker
                key={"user"}
                coordinate={{
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                }}
                anchor={{ x: 0.5, y: 1 }}
            >
                <Image
                    source={Images.userMark}
                    style={{
                        width: size,
                        height: size * markHeight / markWidth
                    }}
                />
            </MapView.Marker>
        );
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
