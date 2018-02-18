import React, { Component } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    ActivityIndicator,
    AsyncStorage,
    InteractionManager
} from "react-native";
import UserInfo from "../../components/UserInfo";
import TabViewFooter from "../../components/TabViewFooter";
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';
import Router from "../../router";
import Images from "../../config/images";
import User from '../../lib/user';
import Auth from '../../lib/Auth';

class ProfileContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };

    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <View style={styles.container}>
                <UserInfo friend={false} user={this.props.user}/>
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
export default ProfileContainer;
