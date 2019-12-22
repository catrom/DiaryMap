import React, { Component } from 'react';
import moment from 'moment'
import { Text, View, StyleSheet } from 'react-native';
import { Calendar, Agenda } from 'react-native-calendars';
import Item from './ui/Item'
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux'
import AddButton from './ui/AddButton'

var event = {}

class AppCalendar extends Component {
    constructor(props){
        super(props);
        this.state = {
            refresh: false,
            dataSource: this.getAllEvent(),
        }
    }

    componentDidMount(){
        Actions.refresh();
    }

    getAllEvent() {
        var events = {};
        firebase.database().ref('event').orderByChild('time').on('value', (dataSnapshot) => {
            dataSnapshot.forEach((childSnapshot) => {
                var item = childSnapshot.val();
                if (item.userid === firebase.auth().currentUser.uid) {
                    var k = moment(item.time).format('YYYY-MM-DD').toString();
                    if (k in events)
                        events[k].push(item);
                    else
                        events[k] = [item];
                };
            });
            try { this.setState({ refresh: !this.state.refresh }); }
            catch{ () => { } };
        })
        return events;
    }

    render() {
        return (
        <View style={{marginTop: 50, marginBottom: 50, flex: 1}}>
            <Agenda  
                items={event}
                // onDayPress={(day)=>{alert(moment(day).format('DD-MM-YYYY'))}}
                loadItemsForMonth={this.loadItemsForMonth}
                pastScrollRange={50}
                futureScrollRange={50}
                renderEmptyDate={this.renderEmptyDate}
                renderItem={this.renderItem}
                // renderDay={this.renderDay}
                rowHasChanged={this.rowHasChanged}
                theme={{
                    selectedDayBackgroundColor: '#914A8A',
                    selectedDayTextColor: '#ffffff',
                    agendaKnobColor: '#914A8A',
                    dotColor: '#78136E',
                    todayTextColor: '#914A8A',
                    agendaTodayColor: '#914A8A',
                }}
            />
            <AddButton/>
        </View>
    )};

    loadItemsForMonth = (selected) => {
        if (!selected)
            return;
        let begin = moment(selected.dateString).startOf('month');
        let end = moment(selected.dateString).endOf('month');
        while (begin.isSameOrBefore(end)) {
            let d = begin.format('YYYY-MM-DD');
            let value = this.state.dataSource[d];
            event[d] = value ? value : [];
            begin.add(1, 'days');
        };
    };

    loadItems = (day) => {
        if (!day)
            return;

    }

    renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}></View>
        );
    };

    renderDay = (day) => {
        return(
            <View>

            </View>
        )
    }

    renderItem = (item) => {
        return (
        // <View style={styles.itemContainer}>
        //     <Text style={styles.itemTitle}>{item.title}</Text>
        //     <Text style={styles.itemText} numberOfLines={3}>{item.text}</Text>
        // </View>
        <View style={{paddingRight: 5}}>
            <Item item={item} />
        </View>
        );
    };

    rowHasChanged = (r1, r2) => {return r1.title !== r2.title};
};

const styles = StyleSheet.create({
    itemContainer: {
        marginTop: 5,
        paddingLeft: 15,
        padding: 5,
        backgroundColor: '#ffffff'
    },
    itemTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#15d1ef'
    },
    itemText: {
        fontSize: 13,
    },
    emptyDate: {
        marginTop: 50,
        marginRight: 10,
        borderTopWidth: 2,
        borderTopColor: '#dddddd',
        height: 5,
    },
})

export default AppCalendar;
