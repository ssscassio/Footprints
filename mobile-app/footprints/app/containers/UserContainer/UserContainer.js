import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    InteractionManager,
    Image,
    TouchableOpacity
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import FireAuth from 'react-native-firebase-auth';
import Images from '../../config/images';
import Colors from '../../config/colors';

class UserContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
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
                        <TouchableOpacity style={styles.btn}>
                            <Image style={styles.btnIcon} source={Images.peopleIcon} />
                            <Text style={styles.btnText}>{'Adicionar amigo'.toUpperCase()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn}>
                            <Image style={styles.btnIcon} source={Images.peopleIcon} />
                            <Text style={styles.btnText}>{'Criar grupo'.toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.groupList}>
                        <TouchableOpacity style={styles.group}>
                            <Image style={styles.groupIcon} source={Images.gpsIcon} />
                            <View style={styles.groupText}>
                                <Text numberOfLines={1} style={styles.groupName}>Grupo</Text>
                                <Text numberOfLines={1} style={styles.groupPeople}>Pessoa 1, pessoa 2, pessoa 3</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.group}>
                            <Image style={styles.groupIcon} source={Images.gpsIcon} />
                            <View style={styles.groupText}>
                                <Text numberOfLines={1} style={styles.groupName}>Grupo 2</Text>
                                <Text numberOfLines={1} style={styles.groupPeople}>Pessoa 1, pessoa 2, pessoa 3</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.group}>
                            <Image style={styles.groupIcon} source={Images.gpsIcon} />
                            <View style={styles.groupText}>
                                <Text numberOfLines={1} style={styles.groupName}>Grupo 3</Text>
                                <Text numberOfLines={1} style={styles.groupPeople}>Pessoa 1, pessoa 2, pessoa 3</Text>
                            </View>
                        </TouchableOpacity>
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
        marginLeft: 20,
        marginRight: 20,
    },
    btn: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnIcon: {
        width: 30,
        height: 30
    },
    btnText: {
        color: Colors.primaryColor
    },
    groupList: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
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
        padding: 10,
        
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
});

//make this component available to the app
export default UserContainer;
