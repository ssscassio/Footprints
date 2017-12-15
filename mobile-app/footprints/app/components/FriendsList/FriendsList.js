import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    SectionList,
    ActivityIndicator 
} from "react-native";
import Images from '../../config/images';
import Colors from '../../config/colors';
import Router from '../../router';
import User from '../../lib/user';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

class FriendsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            myFriends: [],
            myPendingFriends: [],
            loading: false,
            loadingList: false,
        }

        this._updateFriends = this._updateFriends.bind(this);
    }

    componentDidMount() {
        console.log('FriendsList Did Mount');
        this.setState({ loadingList: true });
        this._updateFriends();
    }

    componentDidUpdate() {
        console.log('FriendsList Did Update');
        this._updateFriends();
    }

    _updateFriends = () => {
        const myUID = firebase.auth().currentUser.uid;

        let confirmedFriends, pendingFriends;

        Promise.all([
            User.getConfirmedFriends(myUID),
            User.getPendingFriends(myUID)
        ])
        .then(values => {
            [confirmedFriends, pendingFriends] = values;

            return Promise.all([
                Promise.all(Object.keys(confirmedFriends).map(fid => User.getProfile(fid))),
                Promise.all(Object.keys(pendingFriends).map(fid => User.getProfile(fid)))
            ]);
        })
        .then(values => {
            confirmedFriends = values[0].map(friend => Object.assign(friend, confirmedFriends[friend.id]));
            pendingFriends = values[1].map(friend => Object.assign(friend, pendingFriends[friend.id]));

            confirmedFriends.sort((a,b) => a.name < b.name);
            pendingFriends.sort((a,b) => a.name < b.name);

            if (JSON.stringify(this.state.myFriends) !== JSON.stringify(confirmedFriends) || 
                JSON.stringify(this.state.myPendingFriends) !== JSON.stringify(pendingFriends) ||
                this.state.loadingList) {
                this.setState({ 
                    myFriends: confirmedFriends, 
                    myPendingFriends: pendingFriends,
                    loadingList: false
                });
            } 
        })
        .catch(err => console.log(err));
    }

    _keyExtractor = (item, index) => item.id || index;

    _confirmRequest = (friendId) => {
        this.setState({ loading: true })
        const myUID = firebase.auth().currentUser.uid;

        User.confirmFriend(myUID, friendId)
            .then(values => {
                let newMyFriends = this.state.myFriends;
                let newMyPendingFriends = this.state.myPendingFriends.filter(friend => friend.id !== friendId);

                let confirmedFriend = this.state.myPendingFriends.find(friend => friend.id === friendId);
                confirmedFriend = Object.assign(confirmedFriend, { accepted: true, pending: false });

                newMyFriends.push(confirmedFriend);

                newMyFriends.sort((a,b) => a.name < b.name);
                newMyPendingFriends.sort((a,b) => a.name < b.name);

                this.setState({ 
                    myFriends: newMyFriends,
                    myPendingFriends: newMyPendingFriends,
                    loading: false 
                });
            })
            .catch(err => console.log(err));
    }

    _renderItem = ({item}) => {
        return (
            <TouchableOpacity style={styles.friend}>
                <Image style={styles.friendIcon} source={{uri: item.profile_picture}} />
                <View style={styles.friendTextGroup}>
                    <Text numberOfLines={1} style={styles.friendName}>{item.name}</Text>
                    <Text numberOfLines={1} style={styles.friendEmail}>{item.email}</Text>
                </View>
                { item.pending &&  
                    <View style={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
                        { !this.state.loading && !item.accepted &&
                                <Icon.Button 
                                    name="check" 
                                    underlayColor={'#f2f2f2'}
                                    color={"green"}
                                    backgroundColor={'transparent'}
                                    size={20}
                                    onPress={() => this._confirmRequest(item.id)}
                                />
                        }
                        { this.state.loading && 
                            <ActivityIndicator 
                                size='large' 
                                color='green'
                            />
                        }
                    </View>
                }
            </TouchableOpacity> 
        );
    }

    _renderSection = ({section}) => {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
        );
    }

    render() {
        console.log('FriendsList Render');
        return (
            <View style={styles.container}>
                { !this.state.loadingList &&
                    <SectionList
                        renderItem={this._renderItem}
                        renderSectionHeader={this._renderSection}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        sections={[ 
                            {data: this.state.myFriends, title: 'Confirmados'},
                            {data: this.state.myPendingFriends, title: 'Pendentes'},
                        ]}
                    />
                }
                { this.state.loadingList && 
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator 
                            size='large'
                            color='blue'
                        />
                    </View>
                }
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
    friend: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 10,
    },
    friendIcon: {
        width: 45,
        height: 45,
    },
    friendTextGroup: {
        padding: 10,
    },
    friendName: {
        fontSize: 18,
        color: Colors.darkPrimaryColor
    },
    friendEmail: {
        width: 230
    },
    section: {
        height: 22,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(247,247,247,1.0)',
        padding: 10,
        borderTopWidth: 0.3,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.lightPrimaryColor
    }
});

//make this component available to the app
export default FriendsList;
