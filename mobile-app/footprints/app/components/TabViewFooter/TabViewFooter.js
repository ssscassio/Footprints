import React, { Component } from "react";
import { StyleSheet } from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import colors from "../../config/colors";
import FacebookBar from "./FacebookBar";

class TabViewFooter extends Component {
    _children(children = this.props.children) {
        return React.Children.map(children, child => child);
    }

    _composeScenes() {
        return this._children().map((child, idx) => {
            return child;
        });
    }

    _getIcons() {
        return this._children().map((child, idx) => {
            return child.props.icon;
        });
    }

    render() {
        let { ...props } = this.props;
        return (
            <ScrollableTabView
                renderTabBar={() => (
                    <FacebookBar
                        icons={this._getIcons()}
                        style={styles.tabview}
                    />
                )}
                tabBarBackgroundColor={colors.white}
                tabBarActiveTextColor={colors.accentColor}
                tabBarInactiveTextColor={colors.lightPrimaryColor}
                tabBarUnderlineStyle={{ backgroundColor: colors.accentColor }}
                {...props}
            >
                {this._composeScenes()}
            </ScrollableTabView>
        );
    }
}

const styles = StyleSheet.create({
    tabview: {
        backgroundColor: colors.white,
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: -5
        },
        shadowColor: "#000",
        shadowRadius: 3,
        elevation: 5
    }
});

export default TabViewFooter;
