import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Colors from '../../config/colors';
import Images from '../../config/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import User from '../../lib/user';
import Group from '../../lib/group';

class GroupScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            participants: {},
            group: {}
        }
    }

    componentWillMount(){
        const { participants } = this.props.group;
        this.setState({ group: this.props.group })
        Promise.all(
            Object.keys(participants).map(fid => User.getProfile(fid))
        )
        .then(values => {
            const res = values.reduce((acc, val) => {
                acc[val.id] = { photoURL: val.profile_picture, name: val.name, email: val.email };
                return acc;
            }, {});
            return Promise.resolve(res);
        })
        .then(participants => {
            const ids = Object.keys(participants);
            ids.forEach(id => {
                User.offStatus(id);
                User.onStatus(id, (err, data) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (data == null) data = {};

                    const copy = this.state.participants;
                    const coords = {
                        battery: data.battery ? data.battery : null,
                        id: id,
                        name: participants[id].name,
                        photoURL: participants[id].photoURL,
                        email: participants[id].email,
                        latitude: data.location ? data.location.coords.latitude : 0,
                        longitude: data.location ? data.location.coords.longitude : 0
                    };
                    copy[id] = coords;
                    this.setState({ participants: copy });
                    return;  
                });
            });
        });
    }

    _keyExtractor = (item, index) => item.id || index;

    _renderBattery(battery) {
        const batterySize = 30;
        let name, color;

        if (battery == null) {
            name = 'battery-unknown';
            color = 'black';
        }
        else {
            let level = battery.level*100;

            if (battery.charging) {
                if (level === 100) {
                    name = 'battery-charging-100';
                    color = 'green';
                }
                else if (level >= 90) {
                    name = 'battery-charging-90';
                    color = 'green';
                }
                else if (level >= 70) {
                    name = 'battery-charging-80';
                    color = 'green'; 
                }
                else if (level >= 60) {
                    name = 'battery-charging-60';
                    color = 'lightgreen'; 
                }
                else if (level >= 40) {
                    name = 'battery-charging-40';
                    color = 'lemonchiffon'; 
                }
                else if (level >= 30) {
                    name = 'battery-charging-30';
                    color = 'lemonchiffon'; 
                }
                else {
                    name = 'battery-charging-20';
                    color = 'orange'; 
                }
            }
            else {
                if (level === 100) {
                    name = 'battery';
                    color = 'green';
                }
                else if (level >= 90) {
                    name = 'battery-90';
                    color = 'green';
                }
                else if (level >= 80) {
                    name = 'battery-80';
                    color = 'green'; 
                }
                else if (level >= 60) {
                    name = 'battery-60';
                    color = 'lightgreen'; 
                }
                else if (level >= 40) {
                    name = 'battery-40';
                    color = 'lemonchiffon'; 
                }
                else if (level >= 30) {
                    name = 'battery-30';
                    color = 'lemonchiffon'; 
                }
                else if (level >= 20) {
                    name = 'battery-20';
                    color = 'orange'; 
                }
                else if (level >= 10) {
                    name = 'battery-10';
                    color = 'red'; 
                }
                else {
                    name = 'battery-alert';
                    color = 'red';
                }
            }
        }
        return (<Icon name={name} size={batterySize} color={color}/>)
    }

    _renderItem = ({ item }) => {
        let batteryLevel = null;
        if(item.battery){
            batteryLevel = item.battery.level*100;
        }
        return (
            <View style={styles.item}>
                <View style={{flexDirection: 'row'}}>
                    <Image style={styles.photo} source={{ uri: item.photoURL }}/>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{fontSize: 20, paddingHorizontal: 6}}>{item.name}</Text>
                        <Text style={{fontSize: 14, paddingHorizontal: 6}}>{item.email}</Text>
                    </View>
                </View>
                <View style={{width: 70, flexDirection: 'column', alignItems: 'center'}}>
                    {this._renderBattery(item.battery)}
                    <Text style={{fontSize: 20, paddingHorizontal: 6}}>{parseInt(batteryLevel)}{batteryLevel && ' %'}</Text>
                </View>
            </View>
        );
    }

    
    render() {
        const { name: groupName } = this.state.group;
        const participantesArray = Object.keys(this.state.participants).map(key => this.state.participants[key]);
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={{alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => this.props.navigator.pop()}>
                    <Icon name={'chevron-left'} size={60} color={Colors.primaryColor}/>
                    </TouchableOpacity>
                    <Text style={styles.header}>{groupName}</Text> 
                </View>
                <FlatList 
                        horizontal={false}
                        data={participantesArray}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer:{
        flexDirection: 'row'
    },
    header: {
        color: Colors.primaryColor,
        fontSize: 40,
        paddingVertical: 10
    },
    photo: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginTop: 5,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: Colors.dividerColor
    }
});

export default GroupScreen;
