import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'

export default class Item extends Component {
    render() {
        const item = this.props.item;
        return (
            <TouchableOpacity 
                style={styles.container}
                onPress={() => Actions.event({item})} >
                <View style={{flex: 1}}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.text} numberOfLines={3}>{item.text}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='clock' style={{ marginRight: 3 }} />
                        <Text style={styles.text}>{moment(item.time).format('hh:ss a')}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='map-marker-alt' style={{ marginRight: 4, marginLeft: 2 }} />
                        <Text style={styles.text} numberOfLines={1}>{item.address}</Text>
                    </View>
                </View>
                <Image 
                    source={{uri: item.imageurl}}
                    resizeMethod={'resize'}
                    style={{width: 80, height: 80, resizeMode: 'cover', borderRadius: 5, marginLeft: 3}} />
            </TouchableOpacity>
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
        borderColor: '#510B4A',
        flexDirection: 'row',
        alignItems: 'center',
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
