import React, { Component } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    ActivityIndicator,
    AsyncStorage,
    InteractionManager,
    TouchableOpacity
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'react-native-firebase';
import Router from "../../router";
import Images from "../../config/images";
import User from '../../lib/user';
import Colors from '../../config/colors';
import UserInfo from '../../components/UserInfo';

class FriendScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                        style={{ zIndex: 1, position: 'absolute', top: 10, left: 10}}
                        onPress={() => this.props.navigator.pop()}>
                    <Icon name={'chevron-left'} size={60} color={'white'}/>
                </TouchableOpacity>
                <UserInfo friend={true} user={this.props.user} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        backgroundColor: "white"
    },
});

//make this component available to the app
export default FriendScreen;
