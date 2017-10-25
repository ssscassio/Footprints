import React, { Component } from "react";
import { View, Text, StyleSheet} from "react-native";
import TabViewFooter from "../../components/TabViewFooter";
import Router from "../../router";
import MapContainer from "../../containers/MapContainer";
import SettingsContainer from "../../containers/SettingsContainer";

class HomeScreen extends Component {
    popScreen() {
        this.props.navigator.pop();
    }

    pushScreen(screen, props) {
        this.props.navigator.push(Router.getRoute(screen, props));
    }

    render() {
        return (
            <TabViewFooter tabBarPosition={"bottom"}>
                <View tabLabel="ios-people" />
                <MapContainer tabLabel="ios-pin" />
                <SettingsContainer tabLabel="ios-cog" />
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
