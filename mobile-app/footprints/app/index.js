import React, { Component } from "react";
import { NavigationProvider, StackNavigation } from "@expo/ex-navigation";
import Router from "./router";
import * as firebase from "firebase";

class Footprints extends Component {
    constructor(props) {
        super(props);
        firebase.initializeApp({
            apiKey: "AIzaSyD8mu7TkYracAJHaN6JMUVrcAs7NTqv9n0",
            authDomain: "footprints-fb.firebaseapp.com",
            databaseURL: "https://footprints-fb.firebaseio.com",
            storageBucket: "footprints-fb.appspot.com",
        });
        this.state = {
            initialPage: Router.getRoute("login"),
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
