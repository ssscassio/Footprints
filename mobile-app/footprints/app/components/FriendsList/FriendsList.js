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
        const db = firebase.firestore();

        let data;

        db.collection('users').doc(myUID).get()
            .then(doc => {
                if (doc.exists) {
                    data = doc.data();

                    if (data.friends == null) return;

                    const pendingFriends = Object.keys(data.friends).filter(friendId => data.friends[friendId].pending);
                    const confirmedFriends = Object.keys(data.friends).filter(friendId => !data.friends[friendId].pending);

                    return Promise.all([
                        Promise.all(pendingFriends.map(uid => db.collection('users').doc(uid).get())),
                        Promise.all(confirmedFriends.map(uid => db.collection('users').doc(uid).get())),
                    ]);
                }
                return Promise.reject('Your user doesn\'t exist');
            })
            .then(values => {
                let [pendingFriends,confirmedFriends] = values;

                pendingFriends = pendingFriends.map(doc => doc.exists && Object.assign(doc.data(),{
                    key:doc.id,
                    pending:true,
                    accepted: data.friends[doc.id].accepted
                })).sort((a,b) => a.name < b.name);
                confirmedFriends = confirmedFriends.map(doc => doc.exists && Object.assign(doc.data(),{
                    key:doc.id,
                    pending:false,
                    accepted: true
                })).sort((a,b) => a.name < b.name);

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
            .catch(err => {
                console.log(err);
            });
    }

    _keyExtractor = (item, index) => item.key || index;

    _confirmRequest = (friendId) => {
        this.setState({ loading: true })
        const myUID = firebase.auth().currentUser.uid;
        const db = firebase.firestore(); 

        let myData, friendData;

        Promise.all([
            db.collection('users').doc(myUID).get(),
            db.collection('users').doc(friendId).get()            
        ]).then(docs => {
            const [myDoc, friendDoc] = docs;

            if (myDoc.exists && friendDoc.exists) {
                myData = myDoc.data();
                friendData = friendDoc.data();

                myData.friends[friendId] = {
                    accepted: true,
                    pending: false
                }
                friendData.friends[myUID] = {
                    accepted: true,
                    pending: false
                }

                return Promise.all([
                  db.collection('users').doc(myUID).update({ friends: myData.friends }), 
                  db.collection('users').doc(friendId).update({ friends: friendData.friends })  
                ]);
            }

            return Promise.reject("Your user or friend doesn't exist.");
        })
        .then(() => {
            const newMyFriends = this.state.myFriends;
            newMyFriends.push(Object.assign(friendData, {key:friendId,pending:false}));;
            newMyFriends.sort((a,b) => a.name < b.name);
            const newMyPendingFriends = this.state.myPendingFriends.filter(friend => friend.key !== friendId);
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
                                    onPress={() => this._confirmRequest(item.key)}
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
