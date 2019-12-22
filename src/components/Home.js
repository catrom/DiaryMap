import React, { Component } from 'react'
import { Text, View, FlatList, SectionList } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Item from './ui/Item'
import moment from 'moment'
import firebase from 'firebase'
import AddButton from './ui/AddButton'

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            dataSource: [],
        }
    }

    getAllEvent() {
        let events = {};
        firebase.database().ref('event').orderByChild('time').once('value', (dataSnapshot) => {
            dataSnapshot.forEach((childSnapshot) => {
                let item = childSnapshot.val();
                if (item.userid === firebase.auth().currentUser.uid) {
                    let k = moment(item.time).format('YYYY-MM-DD').toString();
                    if (k in events)
                        events[k].unshift(item);
                    else
                        events[k] = [item];
                }
            });
        try { this.setState({ refresh: !this.state.refresh, dataSource: events }); }
        catch{ () => { } }
        })
        return events;
    }

    componentWillMount(){
        this.setState({dataSource: this.getAllEvent()})
    }

    render() {
        const tSource = Object.keys(this.state.dataSource).reverse();
        return (
            <View style={{ marginTop: 50, marginBottom: 50, flex: 1, backgroundColor: '#eeeeee' }}>
                <FlatList
                    data={tSource}
                    keyExtractor={(item, index) => item + index}
                    numColumns={1}
                    renderItem={({ item }) => {
                        var tSource2 = this.state.dataSource[item];
                        return (
                            <View style={{ marginTop: 10, marginHorizontal: 7, padding: 7, borderRadius: 8, backgroundColor: '#A977A4' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(item).format('DD MMMM YYYY').toUpperCase()}</Text>
                                <FlatList
                                    data={tSource2}
                                    keyExtractor={(item, index) => item.itemid}
                                    renderItem={this.renderItem}
                                    numColumns={1}
                                />
                            </View>
                        )
                    }}
                />
                <AddButton/>
            </View>
        )
    }

    renderItem = ({ item }) => {
        return (
            <View style={{ marginLeft: 20 }}>
                <Item item={item} />
            </View>
        )
    }
}

