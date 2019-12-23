import Icon from 'react-native-vector-icons/FontAwesome5';
import { Actions } from 'react-native-router-flux';
import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default class ShareButton extends Component {
    render() {
        return (
            <TouchableOpacity style={[styles.container, this.props.style]} onPress={this.props.onPress}>
                <Icon name='share' size={18} color='#78136E'  />
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 100,
        width: 40,
        height: 40,
        elevation: 10,
        position: 'absolute',
    }
})
