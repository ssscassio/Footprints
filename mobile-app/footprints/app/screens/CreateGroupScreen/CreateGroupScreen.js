import React, { Component } from "react";
import { 
    View, 
    Text, 
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import Router from "../../router";
import Colors from '../../config/colors';
import User from '../../lib/user';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome';


class CreateGroupScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            chosenFriends: []
        }
    }

    componentDidMount() {
        const myUID = firebase.auth().currentUser.uid;

        User.getConfirmedFriends(myUID)
            .then(friends => {
                const res = Object.keys(friends).map(fid => User.getProfile(fid));
                return Promise.all(res);
            })
            .then(friends => {
                if (friends.length != this.state.friends.length) {
                    this.setState({ friends });
                }
            })
            .catch(err => console.log(err));
    }

    _keyExtractor = (item, index) => item.id || index;

    _addFriend = (friend) => {
        if (!this._isAdded(friend.id)) {
            const arr = this.state.chosenFriends;
            arr.push(friend);
            this.setState({ chosenFriends: arr });
        }
    }

    _removeFriend = (friend) => {
        if (this._isAdded(friend.id)) {
            const arr = this.state.chosenFriends.filter(f => f.id !== friend.id);
            this.setState({ chosenFriends: arr });
        }
    }

    _isAdded = (fid) => {
        return this.state.chosenFriends.find(friend => friend.id === fid);
    }

    _renderItem = ({ item }) => {
        return (
            <TouchableOpacity 
                style={styles.item} 
                onPress={this._isAdded(item.id) ? () => this._removeFriend(item) : () => this._addFriend(item)}
                >
                <View>
                    <Image style={styles.photo} source={{ uri: item.profile_picture }}/>
                    { this._isAdded(item.id) &&
                        <Icon 
                            style={{
                                position: 'absolute',
                                right: -10,
                                bottom: -5
                            }}
                            name="check" 
                            color={'green'}
                            size={30}
                            />
                    }
                </View>
                <View style={styles.friendTexts}>
                    <Text style={{fontSize: 18}}>{item.name}</Text>
                    <Text>{item.email}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    _renderChosenItem = ({ item }) => {
        return (
            <TouchableOpacity 
                style={styles.item} 
                onPress={() => this._removeFriend(item)}
                >
                <View>
                    <Image style={styles.photo} source={{ uri: item.profile_picture }}/>
                    <Icon 
                        style={{
                            position: 'absolute',
                            right: -11,
                            bottom: 24
                        }}
                        name="times-circle" 
                        color={'gray'}
                        size={25}
                        />
                    <Text style={{fontSize: 14, padding: 6}}>{item.name.split(' ')[0]}</Text>
                </View>
            </TouchableOpacity> 
        );
    }

    _goToGroupNameScreen = () => {
        if (this.state.chosenFriends.length > 0)
            this.props.navigator.push(Router.getRoute('groupName', { friends: this.state.chosenFriends }));
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Novo Grupo</Text> 
                <View style={styles.chosenPeople}>
                    <FlatList 
                        data={this.state.chosenFriends}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderChosenItem}
                    /> 
                </View>
                <View style={styles.friendsList}>
                    <FlatList 
                        data={this.state.friends}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />
                </View>
                <View
                    elevation={3}
                    style={{
                        position: 'absolute',
                        width: 50,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        bottom: 20,
                        right: 20,
                        borderRadius: 25,
                        backgroundColor: Colors.primaryColor
                    }}>
                <Icon.Button
                    color={'white'}
                    iconStyle={{marginRight: 0}}
                    name="arrow-right"
                    size={25}
                    borderRadius={20}
                    activeOpacity={1}
                    underlayColor={Colors.lightPrimaryColor}
                    backgroundColor={"transparent"} 
                    onPress={this._goToGroupNameScreen}/>
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
        backgroundColor: "white",
        padding: 10
    },
    header: {
        color: Colors.primaryColor,
        fontSize: 40,
        borderBottomWidth: 0.5,
        padding: 10
    },
    chosenPeople: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    friendsList: {},
    photo: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: 10,
    },
    friendTexts: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10
    }
});

//make this component available to the app
export default CreateGroupScreen

