import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";

class FacebookBar extends React.Component {
    constructor(props) {
        super(props);
        this.tabIcons = [];
        this.tabComponents = [];
    }

    componentDidMount() {
        this._listener = this.props.scrollValue.addListener(
            this.setAnimationValue.bind(this)
        );
    }

    setAnimationValue({ value }) {
        this.tabIcons.forEach((icon, i) => {
            const progress = Math.min(1, Math.abs(value - i));
            icon.setNativeProps({
                style: {
                    color: this.iconColor(progress)
                }
            });
        });

        this.tabComponents.forEach((comp, i) => {
            const progress = Math.min(1, Math.abs(value - i));
            comp.setNativeProps({
                style: {
                    opacity: this.opacityProgress(progress)
                }
            });
        });
    }

    //color between
    opacityProgress(progress) {
        const opacity = 1 + (0.5 - 1) * progress;

        return opacity;
    }

    //color between rgb(33, 152, 243) and rgb(255, 86, 34)
    iconColor(progress) {
        const r = 255 + (33 - 255) * progress;
        const g = 86 + (152 - 86) * progress;
        const b = 34 + (243 - 34) * progress;

        return `rgb(${r}, ${g}, ${b})`;
    }

    render() {
        return (
            <View style={[styles.tabs, this.props.style]}>
                {this.props.tabs.map((tab, i) => {
                    return (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => this.props.goToPage(i)}
                            style={styles.tab}
                        >
                            {this.props.icons[i] ? (
                                <View
                                    style={{
                                        opacity:
                                            this.props.activeTab === i ? 1 : 0.5
                                    }}
                                    ref={comp => {
                                        this.tabComponents[i] = comp;
                                    }}
                                >
                                    {this.props.icons[i]}
                                </View>
                            ) : (
                                <Icon
                                    name={tab}
                                    size={30}
                                    color={
                                        this.props.activeTab === i
                                            ? colors.accentColor
                                            : colors.primaryColor
                                    }
                                    ref={icon => {
                                        this.tabIcons[i] = icon;
                                    }}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }
}

FacebookBar.propTypes = {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array
};

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 10
    },
    tabs: {
        height: 45,
        flexDirection: "row",
        paddingTop: 5,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomColor: "rgba(0,0,0,0.05)"
    }
});

export default FacebookBar;
