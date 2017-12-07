import React, { Component } from "react";
import { 
    View, 
    Text, 
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    ActivityIndicator
} from "react-native";
import Router from "../../router";
import Colors from '../../config/colors';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome';


class AddFriendScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            loading: false,
            users: []
        }
        this.myFriends = [];
    }

    componentDidMount() {
        const myUID = firebase.auth().currentUser.uid;
        
        firebase.firestore().collection('users').doc(myUID).get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    if (data.friends != null) {
                        this.myFriends = data.friends;
                        console.log(this.myFriends);
                    }
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    _keyExtractor = (item, index) => {
        return item.key;        
    }

    _onAdd = (friendId, friendsFriends) => {
        const myUID = firebase.auth().currentUser.uid;
        const db = firebase.firestore();
        this.setState({ loading: true });
        this.myFriends = Object.assign(this.myFriends, {
            [friendId]: {
                accepted: true,
                pending: true
            }
        });

        friendsFriends = Object.assign(friendsFriends || {}, {
            [myUID]: {
                accepted: false,
                pending: true
            }
        });

        const myRef = db.collection('users').doc(myUID);
        const friendRef = db.collection('users').doc(friendId);

        Promise.all([
            myRef.update({friends: this.myFriends}),
            friendRef.update({friends: friendsFriends})
        ]).then(() => {
            this._onChangeText(this.state.text);
            this.setState({ loading: false });
        })
    }

    _renderItem = ({item}) => {
        return (
            <View style={styles.listItem}>
                <Image style={styles.userPhoto} source={{ uri: item.photo }}/>
                <View style={styles.userTexts}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                </View>
                <View>
                    <Icon.Button 
                        iconStyle={{marginRight: 0}}
                        underlayColor={'#f2f2f2'}
                        name='plus'
                        size={25}
                        color={item.disabled ? 'gray': 'green'}
                        backgroundColor={'transparent'}
                        onPress={() => this._onAdd(item.key, item.friends)}
                        disabled={item.disabled}
                    />
                </View>
            </View>
        );
    }

    _onChangeText = (text) => {
        const myUID = firebase.auth().currentUser.uid;
        const db = firebase.firestore();

        this.setState({ text });
        if (text.length == 0) return;

        db.collection('users')
            .orderBy('email')
            .startAt(text)
            .endAt(text+'\uf8ff')
            .limit(10).get()
            .then((snapshot) => {
                const users = snapshot.docs.map(doc => {
                    return {
                        key: doc.id, 
                        photo: doc.data().profile_picture,  
                        name: doc.data().name, 
                        email: doc.data().email,
                        friends: doc.data().friends,
                        disabled: Object.keys(this.myFriends).includes(doc.id)
                    }
                });

                this.setState({ users: users.filter(user => user.key !== myUID) });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput 
                    style={{ height: 40, borderColor: Colors.primaryColor, borderWidth: 1}}
                    onChangeText={this._onChangeText}
                    value={this.state.text}
                />
                <View style={{ paddingTop: 20 }}>
                    <FlatList
                        data={this.state.users}
                        extraData={this.state.users}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />
                </View>
                { this.state.loading && 
                    <View style={styles.loading}>
                        <ActivityIndicator 
                            color='blue'
                            size='large'
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
        backgroundColor: "white",
        padding: 10
    },
    listItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',  
        padding: 10,
        borderBottomWidth: 0.8,
        borderBottomColor: '#f2f2f2',
    },
    userPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'transparent',
    },
    userName: {
        fontSize: 20
    },
    userEmail: {
        fontSize: 12
    },
    userTexts: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5FCFF88'
    }
});

//make this component available to the app
export default AddFriendScreen

