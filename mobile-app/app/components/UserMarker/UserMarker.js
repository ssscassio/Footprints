import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
} from "react-native";
import MapView from "react-native-maps";
import Images from "../../config/images";
import Colors from "../../config/colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class UserMarker extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
    }



    _renderBattery(battery) {
        const batterySize = 22;
        let name, color;

        if (battery == null) {
            name = 'battery-unknown';
            color = 'black';
        }
        else {
            let level = battery.level*100;

            if (battery.charging) {
                if (level === 100) {
                    name = 'battery-charging-100';
                    color = 'green';
                }
                else if (level >= 90) {
                    name = 'battery-charging-90';
                    color = 'green';
                }
                else if (level >= 70) {
                    name = 'battery-charging-80';
                    color = 'green'; 
                }
                else if (level >= 60) {
                    name = 'battery-charging-60';
                    color = 'lightgreen'; 
                }
                else if (level >= 40) {
                    name = 'battery-charging-40';
                    color = 'lemonchiffon'; 
                }
                else if (level >= 30) {
                    name = 'battery-charging-30';
                    color = 'lemonchiffon'; 
                }
                else {
                    name = 'battery-charging-20';
                    color = 'orange'; 
                }
            }
            else {
                if (level === 100) {
                    name = 'battery';
                    color = 'green';
                }
                else if (level >= 90) {
                    name = 'battery-90';
                    color = 'green';
                }
                else if (level >= 80) {
                    name = 'battery-80';
                    color = 'green'; 
                }
                else if (level >= 60) {
                    name = 'battery-60';
                    color = 'lightgreen'; 
                }
                else if (level >= 40) {
                    name = 'battery-40';
                    color = 'lemonchiffon'; 
                }
                else if (level >= 30) {
                    name = 'battery-30';
                    color = 'lemonchiffon'; 
                }
                else if (level >= 20) {
                    name = 'battery-20';
                    color = 'orange'; 
                }
                else if (level >= 10) {
                    name = 'battery-10';
                    color = 'red'; 
                }
                else {
                    name = 'battery-alert';
                    color = 'red';
                }
            }
        }
        return (<Icon name={name} size={batterySize} color={color}/>)
    }

    _renderCallout() {
        return (
            <MapView.Callout style={styles.plainView}>
                <View style={{ 
                    flex: 1, 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    alignItems: 'center'
                    }}>
                    <Text>{this.props.user.name}</Text>
                    <View style={{
                        flexDirection: 'row', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                        }}>
                        {this.props.user.battery != null && 
                            <Text style={{marginRight: 5}}>{Math.floor(this.props.user.battery.level*100)+'%'}</Text> 
                        }
                        {this._renderBattery(this.props.user.battery)}
                    </View>
                </View>
            </MapView.Callout> 
        );
    }

    showCallout() {
        this.marker.showCallout();
    }

    hideCallout() {
        this.marker.hideCallout();
    }

    render() {
        return (
            <MapView.Marker
                ref={ref => { this.marker = ref }}
                identifier={this.props.user.id}
                coordinate={{
                    latitude: parseFloat(this.props.user.latitude),
                    longitude: parseFloat(this.props.user.longitude),
                }}
                title={this.props.user.name}
                anchor={{ x: 0.5, y: 0.5 }}
            >
                <Image
                    source={{uri: this.props.user.photoURL}}
                    style={{
                        width: this.props.isCurrentUser ? 40  : 36,
                        height: this.props.isCurrentUser ? 40  : 36,
                        borderRadius: this.props.isCurrentUser ? 20  : 18,
                        borderWidth: 2,
                        borderColor: this.props.isCurrentUser ? Colors.primaryColor : Colors.accentColor
                    }}
                />
                {this._renderCallout()}
            </MapView.Marker>
        );
    }
}

const styles = StyleSheet.create({
    plainView: {
        width: 70,
        height: 60
    }
});

//make this component available to the app
export default UserMarker;
