import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, Dimensions, FlatList, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import AddButton from './ui/AddButton';

class Album extends Component {
    constructor(props){
        super(props);
        this.state = {
            refresh: false,
            dataSource: this.getAllEvent(),
        }
    }

    getAllEvent(){
        var events = [];
        firebase.database().ref('event').orderByChild('time').on('value', (dataSnapshot) => {
            dataSnapshot.forEach((childSnapshot) => {
                var item = childSnapshot.val();
                if(item.userid == firebase.auth().currentUser.uid && item.imageurl != '')
                    events.unshift(item);
            });
            try{this.setState({ refresh: !this.state.refresh });}
            catch{()=>{}}
        })
        return events;
    }

    render() {
        return (
            <View style={{ marginTop: 50, marginBottom: 50, flex: 1 }} >
                <FlatList
                    data={this.state.dataSource}
                    extraData={this.state.refresh}
                    keyExtractor={(item, index) => item.itemid }
                    renderItem={this.renderItem}
                    numColumns={3}
                />
                <AddButton/>
            </View>
        )
    }

    renderItem = ({item}) => {
        return (
            <TouchableOpacity onPress={() => Actions.event({item})}>
                <Image 
                    source={{uri: item.imageurl}} style={styles.imageItem}
                    resizeMethod={'resize'} />
                    
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    imageItem: {
        width: Dimensions.get('window').width/3 - 6, 
        height: Dimensions.get('window').width/3 - 6,
        resizeMode: 'cover',
        marginLeft: 2,
        marginTop: 2
    }
})

export default Album;
