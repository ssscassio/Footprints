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
import LinearGradient from 'react-native-linear-gradient';
import FireAuth from 'react-native-firebase-auth';
import Images from '../../config/images';
import Colors from '../../config/colors';

class SettingsContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {

        return (
            <View style={styles.container}>
                <Image style={styles.header} source={Images.settingsBk}>
                    <LinearGradient
                        colors={['transparent', '#ffffff']}
                        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    />
                    <View style={styles.headerTextContainer}>
                        <Image style={styles.headerIcon} source={Images.cogIcon} />
                        <Text style={styles.headerText}>{'Ajustes'.toUpperCase()}</Text>
                    </View>
                </Image>
                <View style={styles.items}>
                    <TouchableOpacity style={styles.item} onPress={FireAuth.logout}>
                        <Image style={styles.itemIcon} source={Images.exitIcon} />
                        <Text style={styles.itemText}>{'Logout'.toUpperCase()}</Text>
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
    header: {
        flex: 1,
        resizeMode: 'stretch',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        backgroundColor: 'transparent',
    },
    headerText: {
        fontFamily: 'arial',
        color: Colors.primaryColor,
        fontSize: 40,
        paddingLeft: 10
    },
    headerIcon: {
        width: 60,
        height: 60,
    },
    headerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start', 
        alignItems: 'center',
        paddingLeft: 10
    },
    items: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        marginTop: 10
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 10,
        paddingLeft: 20,
        marginTop: 10
    },
    itemIcon: {
        width: 30,
        height: 30
    },
    itemText: {
        fontFamily: 'arial',
        color: Colors.primaryColor,
        fontSize: 20,
        paddingLeft: 10
    }
});

//make this component available to the app
export default SettingsContainer;
