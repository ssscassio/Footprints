import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    InteractionManager,
    Image,
    TouchableOpacity,
    FlatList,
    SectionList,
    TouchableHighlight
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Images from '../../config/images';
import Colors from '../../config/colors';
import Router from '../../router';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

class UserContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            friends: true,
            myFriends: [],
            myPendingFriends: []
        }

        this.goToAddFriendScreen = this.goToAddFriendScreen.bind(this);
    }

    componentDidMount() {
        const myUID = firebase.auth().currentUser.uid;
        const db = firebase.firestore();

        db.collection('users').doc(myUID).get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data();

                    if (data.friends == null) return;

                    const pendingFriends = Object.keys(data.friends)
                                                .filter(friendId => data.friends[friendId].pending);
                    const confirmedFriends = Object.keys(data.friends)
                                                .filter(friendId => !data.friends[friendId].pending);

                    Promise.all([
                        Promise.all(pendingFriends.map(uid => db.collection('users').doc(uid).get())),
                        Promise.all(confirmedFriends.map(uid => db.collection('users').doc(uid).get())),
                    ])
                    .then(values => {
                        let pendingFriends = values[0];
                        let confirmedFriends = values[1];

                        pendingFriends = pendingFriends.map(doc => doc.exists && Object.assign(doc.data(),{key:doc.id}));
                        confirmedFriends = confirmedFriends.map(doc => doc.exists && Object.assign(doc.data(),{key:doc.id}));

                        this.setState({ 
                            myFriends: confirmedFriends, 
                            myPendingFriends: pendingFriends
                        });
                    });   
                }
            })
            .catch(err => {
                console.log(err);
            });

    }

    _keyExtractor = (item, index) => item.key || index;

    goToAddFriendScreen () {
        console.log('here');
        this.props.navigator.push(Router.getRoute('addFriend'));
    }

    renderItem = ({item}) => {
        const picture = item.profile_picture ? {uri: item.profile_picture} : Images.gpsIcon
        return (
            <TouchableOpacity style={styles.group}>
                <Image style={styles.groupIcon} source={picture} />
                <View style={styles.groupText}>
                    <Text numberOfLines={1} style={styles.groupName}>{item.name}</Text>
                    <Text numberOfLines={1} style={styles.groupPeople}>{item.email}</Text>
                </View>
            </TouchableOpacity> 
        );
    }

    renderSection = ({section}) => {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
        );
    }

    render() {

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
                        { !this.state.friends &&
                            <FlatList 
                                data={[ {name: 'grupo 1', people: 'p1p2p3'}, 
                                        {name: 'grupo 2', people: 'p1p2p3'},
                                        {name: 'grupo 3', people: 'p1p2p3'}
                                    ]}
                                keyExtractor={this._keyExtractor}
                                renderItem={this.renderItem}
                            />
                        }
                        { this.state.friends && 
                            <SectionList
                                renderItem={this.renderItem}
                                renderSectionHeader={this.renderSection}
                                extraData={this.state}
                                keyExtractor={this._keyExtractor}
                                sections={[ // homogeneous rendering between sections
                                    {data: this.state.myFriends, title: 'Confirmados'},
                                    {data: this.state.myPendingFriends, title: 'Pendentes'},
                                ]}
                            />
                        }
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
                            onPress={this.goToAddFriendScreen}/>
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
    group: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 10,
    },
    groupIcon: {
        width: 30,
        height: 30
    },
    groupText: {
        padding: 10
    },
    groupName: {
        fontSize: 18,
        color: Colors.darkPrimaryColor
    },
    groupPeople: {
        width: 300
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
export default UserContainer;
