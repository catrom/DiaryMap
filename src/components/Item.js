import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Home extends Component {
  render() {
    const item = this.props.item;
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text} numberOfLines={3}>{item.text}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name='map-marker' style={{marginRight: 3}}/>
                <Text style={styles.text}>Đông Hoà, Dĩ An, Bình Dương</Text>
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        paddingLeft: 15,
        padding: 5,
        backgroundColor: '#ffffff',
        borderLeftWidth: 5,
        borderRadius: 3,
        borderColor: '#f4a55d'
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#78136E'
    },
    text: {
        fontSize: 13,
        textAlign: 'justify'
    }
})
