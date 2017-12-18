import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    ActivityIndicator 
} from "react-native";
import Images from '../../config/images';
import Colors from '../../config/colors';
import Router from '../../router';
import User from '../../lib/user';
import Group from '../../lib/group';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

class GroupsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: [],
            loadingList: true
        }

        this.user = JSON.parse(props.user); 

    }

    componentDidMount() {
        console.log('GroupsList Did Mount');
        this.setState({ loadingList: true });
    }

    componentDidUpdate() {
        console.log('GroupsList Did Update');
        this._updateGroups();
    }

    _updateGroups = () => {
        const myUID = this.user.uid;

        User.getGroups(myUID)
        .then(groups => {
            const res = Object.keys(groups).map(gid => Group.getGroup(gid));
            return Promise.all(res);
        })
        .then(groups => {
            if (groups.length != this.state.groups.length || this.state.loadingList) {
                this.setState({ groups, loadingList: false});
            }
        })
        .catch(err => console.log(err));
    }

    _keyExtractor = (item, index) => item.id || index;

    _renderItem = ({item}) => {
        return (
            <TouchableOpacity style={styles.group}>
                <Image style={styles.groupIcon} source={Images.gpsIcon} />
                <View style={styles.groupTextGroup}>
                    <Text numberOfLines={1} style={styles.groupName}>{item.name}</Text>
                </View>
            </TouchableOpacity> 
        );
    }

    render() {
        console.log('GroupsList Render');
        return (
            <View style={styles.container}>
                { !this.state.loadingList &&
                    <FlatList
                        renderItem={this._renderItem}
                        data={this.state.groups}
                        extraData={this.state.groups}
                        keyExtractor={this._keyExtractor}
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
    group: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
    },
    groupIcon: {
        width: 45,
        height: 45,
    },
    groupTextGroup: {
        padding: 10,
    },
    groupName: {
        fontSize: 18,
        color: Colors.darkPrimaryColor
    },
    groupSub: {
        width: 230
    },
});

//make this component available to the app
export default GroupsList;
