import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Switch,
    AsyncStorage,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Images from "../../config/images";
import Colors from "../../config/colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BATTERY_SWITCH_KEY = 'battery-switch-key';

class UserInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: JSON.parse(this.props.user),
            batterySwitchVal: false
        };

        this.onBatterySwitchChange = this.onBatterySwitchChange.bind(this);
    }

    componentDidMount() {
        AsyncStorage.getItem(`${BATTERY_SWITCH_KEY}-${this.state.user.uid}`)
            .then(val => {
                if (val != null) {
                    const data = JSON.parse(val);
                    this.setState({ batterySwitchVal: data.battery });
                }
            })
            .catch(err => console.log(err));
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
    }

    onBatterySwitchChange(value) {
        AsyncStorage.setItem(`${BATTERY_SWITCH_KEY}-${this.state.user.uid}`, JSON.stringify({name: this.state.user.displayName, uid: this.state.user.uid, battery: value }))
            .then(() => {
                this.setState({ batterySwitchVal: value });
            })
            .catch(err => console.log(err));
    }

    render() {
        const { photoURL, displayName, email } = this.state.user;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image style={styles.photo} source={{ uri: photoURL }}/>
                    <LinearGradient
                        colors={['transparent', '#ffffff']}
                        style={{position: 'absolute', top: 100, left: 0, right: 0, bottom: 0 }}
                    />
                </View>
                <View style={styles.content}>
                    <Text style={styles.userName}>{displayName}</Text>
                    <Text style={styles.userEmail}>{email}</Text>

                    {this.props.friend && 
                        <View style={styles.batterySwitch}>
                            <Text>Alertar bateria baixa</Text>
                            <Switch value={this.state.batterySwitchVal} onValueChange={this.onBatterySwitchChange} />
                        </View>
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    photo: {
        height: 90,
        width: 90,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: 'white'
    },
    header: {
        flex: 1,
        backgroundColor: Colors.primaryColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        flex: 2
    },
    userName: {
        color: Colors.primaryColor,
        paddingLeft: 30,
        paddingTop: 30,
        fontSize: 35
    },
    userEmail: {
        color: Colors.primaryText,
        paddingLeft: 30,
        paddingTop: 10,
        fontSize: 20
    },
    batterySwitch: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
});

//make this component available to the app
export default UserInfo;
