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
    ToastAndroid
} from "react-native";
import Router from "../../router";
import Colors from '../../config/colors';
import User from '../../lib/user';
import Group from '../../lib/group';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome';


class GroupNameScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
        };

        this.user = JSON.parse(this.props.user);
    }

    componentDidMount() {
    }

    _keyExtractor = (item, index) => item.id || index;

    _renderItem = ({ item }) => {
        return (
            <View style={styles.item}>
                <View>
                    <Image style={styles.photo} source={{ uri: item.profile_picture }}/>
                    <Text style={{fontSize: 14, padding: 6}}>{item.name.split(' ')[0]}</Text>
                </View>
            </View>
        );
    }

    _createGroup = () => {
        if (this.state.name === '') return;
        const myUID = this.user.uid;

        const participants = this.props.friends.reduce((acc,friend) => {
            acc[friend.id] = true;
            return acc;
        }, {});
        participants[myUID] = true;

        const params = {
            name: this.state.name,
            owner: myUID,
            participants: participants
        };

        Group.createGroup(params)
        .then(gref => {
            const res = Object.keys(participants).map(id => User.joinGroup(id, gref.id));
            return Promise.all(res);
        })
        .then(() => {
            ToastAndroid.show('Grupo criado com sucesso!', ToastAndroid.BOTTOM);
            this.props.navigator.pop(2);
        })
        .catch(err => console.log(err));
    }

    _onChangeText = (name) => {
        this.setState({ name });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Nome do Grupo</Text> 
                <TextInput 
                    style={{ 
                        marginLeft: 5, 
                        marginRight: 5, 
                        height: 50, 
                        borderColor: Colors.primaryColor, 
                        borderWidth: 1
                    }}
                    onChangeText={this._onChangeText}
                    value={this.state.name}
                />
                <View style={styles.participants}>
                    <Text>{`Participantes: ${this.props.friends.length}`}</Text>
                    <FlatList 
                        horizontal={false}
                        numColumns={3}
                        data={this.props.friends}
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
                    onPress={this._createGroup}/>
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
    participants: {
        padding: 10,
    },
    photo: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    item: {
        width: 80,
        height: 100,
        padding: 10,
        marginTop: 5,
    },
});

//make this component available to the app
export default GroupNameScreen

