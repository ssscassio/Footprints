import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    InteractionManager,
    Image,
    TouchableOpacity,
    TouchableHighlight,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Images from '../../config/images';
import Colors from '../../config/colors';
import Router from '../../router';
import FriendsList from '../../components/FriendsList';
import GroupsList from '../../components/GroupsList';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

class UserContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            friends: true
        }

        this.user = JSON.parse(props.user);

        this._goToAddScreen = this._goToAddScreen.bind(this);
    }

    componentDidMount() {
        console.log('UserContainer Did Mount');
       
    }

    componentDidUpdate() {
        console.log('UserContainer Did Update')        
    }

    componentWillUnmount() {
        console.log('UserContainer will unmount');
    }

    _keyExtractor = (item, index) => item.key || index;

    _goToAddScreen (isFriends) {
        if (isFriends)
            this.props.navigator.push(Router.getRoute('addFriend', { user: this.props.user }));
        else 
            this.props.navigator.push(Router.getRoute('createGroup', { user: this.props.user }));
    }

    render() {
        console.log('UserContainer Render');
        return (
            <View style={styles.container}>
                <Image style={styles.header} source={Images.groupsBk}>
                    <LinearGradient
                        colors={['transparent', '#ffffff']}
                        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    />
                    <View style={styles.headerTextContainer}>
                        <Image style={styles.headerIcon} source={Images.usersIcon} />
                        <Text style={styles.headerText}>{'Grupos & Amigos'.toUpperCase()}</Text>
                    </View>
                </Image>
                <View style={styles.items}>
                    <View style={styles.btns}>
                        <TouchableOpacity style={styles.btn} onPress={() => this.setState({friends: true})}>
                            <Image style={styles.btnIcon} source={Images.peopleIcon} />
                            <Text style={styles.btnText}>{'Amigos'.toUpperCase()}</Text>
                            { this.state.friends &&
                                <LinearGradient
                                    colors={['transparent', Colors.lightPrimaryColor]}
                                    style={styles.btnGradient}
                                />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={() => this.setState({friends: false})}>
                            <Image style={styles.btnIcon} source={Images.peopleIcon} />
                            <Text style={styles.btnText}>{'Grupos'.toUpperCase()}</Text>
                            { !this.state.friends &&
                                <LinearGradient
                                    colors={['transparent', Colors.lightPrimaryColor]}
                                    style={styles.btnGradient}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.groupList}>
                        { !this.state.friends && <GroupsList user={this.props.user} /> }
                        { this.state.friends && <FriendsList user={this.props.user} /> }
                        <View
                            elevation={3}
                            style={{
                                position: 'absolute',
                                width: 40,
                                height: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                bottom: 20,
                                right: 20,
                                borderRadius: 20,
                                backgroundColor: Colors.primaryColor
                            }}>
                        <Icon.Button
                            color={'white'}
                            iconStyle={{marginRight: 0}}
                            name="plus"
                            size={25}
                            borderRadius={20}
                            activeOpacity={1}
                            underlayColor={Colors.lightPrimaryColor}
                            backgroundColor={"transparent"} 
                            onPress={() => this._goToAddScreen(this.state.friends)}/>
                        </View>
                    </View>
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
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        backgroundColor: 'transparent'
    },
    headerText: {
        fontFamily: 'arial',
        color: Colors.primaryColor,
        fontSize: 40,
        paddingLeft: 10
    },
    headerIcon: {
        width: 50,
        height: 50
    },
    headerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start', 
        alignItems: 'center',
        height: 100,
        width: 300,
        paddingLeft: 10
    },
    btns: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        borderBottomColor: Colors.primaryColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    btn: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    btnGradient: {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: -40, 
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.lightPrimaryColor 
    },
    btnIcon: {
        width: 30,
        height: 30
    },
    btnText: {
        color: 'black'
    },
    groupList: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    items: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white',
    },
});

//make this component available to the app
export default UserContainer;
