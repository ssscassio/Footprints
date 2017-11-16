import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    InteractionManager,
    Image,
    TouchableOpacity
} from "react-native";
import MapView from "react-native-maps";
import FireAuth from 'react-native-firebase-auth';

class SettingsContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={FireAuth.logout}>
                    <Text style={styles.settingText}>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: 20
    },
    settingText: {
        fontSize: 32,
        fontFamily: 'arial'
    }
});

//make this component available to the app
export default SettingsContainer;