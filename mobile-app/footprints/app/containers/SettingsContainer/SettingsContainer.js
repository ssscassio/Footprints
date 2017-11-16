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
                <View style={styles.item}>
                    <TouchableOpacity onPress={FireAuth.logout}>
                        <Text style={styles.settingText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: "stretch",
    },
    settingText: {
        fontSize: 28,
        fontFamily: 'arial',
        color: 'black',
    },
    item: {
        borderBottomColor: '#bbb', 
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: 10,
        paddingBottom: 10,
        paddingLeft: 10
    }
});

//make this component available to the app
export default SettingsContainer;
