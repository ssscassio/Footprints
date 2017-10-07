import React, { Component } from "react";
import { NavigationProvider, StackNavigation } from "@expo/ex-navigation";
import Router from "./router";

class Footprints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialPage: Router.getRoute("home"),
            loaded: false
        };
    }

    render() {
        return (
            <NavigationProvider router={Router}>
                <StackNavigation initialRoute={this.state.initialPage} />
            </NavigationProvider>
        );
    }
}

//make this component available to the App
export default Footprints;
