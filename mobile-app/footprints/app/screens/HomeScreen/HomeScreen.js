import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import TabViewFooter from "../../components/TabViewFooter";
import Router from "../../router";
import MapContainer from "../../containers/MapContainer";
import SettingsContainer from "../../containers/SettingsContainer";
import UserContainer from "../../containers/UserContainer";

class HomeScreen extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <TabViewFooter tabBarPosition={"bottom"}>
                <UserContainer 
                    navigator={this.props.navigator} 
                    tabLabel="ios-people"
                    user={this.props.user} />
                <MapContainer 
                    tabLabel="ios-pin"
                    user={this.props.user}
                    lastCoords={this.props.lastCoords} />
                <SettingsContainer 
                    navigator={this.props.navigator} 
                    tabLabel="ios-cog"
                    user={this.props.user} />
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
