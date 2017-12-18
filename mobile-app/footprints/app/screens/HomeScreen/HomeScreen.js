import React, { Component } from "react";
import { View, Text, StyleSheet, BackHandler } from "react-native";
import TabViewFooter from "../../components/TabViewFooter";
import Router from "../../router";
import MapContainer from "../../containers/MapContainer";
import SettingsContainer from "../../containers/SettingsContainer";
import UserContainer from "../../containers/UserContainer";

class HomeScreen extends Component {

    constructor(props) {
        super(props);

    }
    
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.props.navigator.getCurrentIndex() > 1) {
                this.props.navigator.pop();
                return true;
            }
            else BackHandler.exitApp();
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress');
    }

    popScreen() {
        this.props.navigator.pop();
    }

    pushScreen(screen, props) {
        this.props.navigator.push(Router.getRoute(screen, props));
    }

    render() {
        return (
            <TabViewFooter tabBarPosition={"bottom"}>
                <UserContainer 
                    navigator={this.props.navigator} 
                    tabLabel="ios-people" />
                <MapContainer 
                    tabLabel="ios-pin" />
                <SettingsContainer 
                    navigator={this.props.navigator} 
                    tabLabel="ios-cog" />
            </TabViewFooter>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2c3e50"
    }
});

//make this component available to the app
export default HomeScreen;
