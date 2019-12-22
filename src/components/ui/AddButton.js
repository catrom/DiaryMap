import Icon from 'react-native-vector-icons/FontAwesome5';
import { Actions } from 'react-native-router-flux';
import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default class AddButton extends Component {

    onPress = () => {
        Actions.add();
    }

    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={this.onPress}>
                <Icon name='plus' size={25} color='#78136E'  />
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 100,
        width: 60,
        height: 60,
        elevation: 10,
        position: 'absolute',
        bottom: 15,
        right: 15
    }
})
