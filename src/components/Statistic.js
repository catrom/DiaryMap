import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, ImageBackground, FlatList } from 'react-native'
import firebase from 'firebase'
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import { Actions, ActionConst } from 'react-native-router-flux';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    XAxis
} from 'react-native-chart-kit';
import CustomCard from './ui/CustomCard';
import { AreaChart, Grid } from 'react-native-svg-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale'

const screenWidth = Dimensions.get('window').width

const chartConfig = {
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    color: ((opacity = 1) => `rgba(169, 119, 164, ${opacity})`),
    
}

export default class Statistic extends Component {
    constructor(props) {
        super(props)
    }

    createMonthData = () => {
        const numOfMonth = 6;
        const now = moment().format();
        var listMonth = [];

        var tmp = moment().endOf('month');
        tmp.add(-15, 'd');
        for (let i = 0; i < numOfMonth; i++) {
            listMonth.unshift(moment(tmp).add(-i, 'M').format('YYYY-MM'));
        }
        return listMonth;
    }

    getCountData = () => {
        let events = [0, 0, 0, 0, 0, 0];
        const listM = this.createMonthData();
        firebase.database().ref('event').orderByChild('time').once('value', (dataSnapshot) => {
            dataSnapshot.forEach((childSnapshot) => {
                let item = childSnapshot.val();
                if (item.userid === firebase.auth().currentUser.uid) {
                    let k = moment(item.time).format('YYYY-MM');
                    for (let i = 0; i < 6; i++) {
                        if (k == listM[i])
                            events[i] = events[i] + 1;
                    }
                }
            });
        })
        return events;
    }

    getPlaceData = () => {
        let places = []
        firebase.database().ref('event').orderByChild('address').once('value', (dataSnapshot) => {
            dataSnapshot.forEach((childSnapshot) => {
                let item = childSnapshot.val();
                if (item.userid === firebase.auth().currentUser.uid) {
                    if (!places.includes(item.address)) {
                        places.push(item.address)
                    }
                }
            });
        })
        return places;
    }

    getEmotionData = () => {
        let d = [];
        let events = [0, 0, 0, 0, 0, 0];
        let count = [0, 0, 0, 0, 0, 0];
        const listM = this.createMonthData();
        firebase.database().ref('event').orderByChild('time').once('value', (dataSnapshot) => {
            dataSnapshot.forEach((childSnapshot) => {
                let item = childSnapshot.val();
                if (item.userid === firebase.auth().currentUser.uid) {
                    let k = moment(item.time).format('YYYY-MM');
                    for (let i = 0; i < 6; i++) {
                        if (k == listM[i])
                        {
                            events[i] = events[i] + item.emotion;
                            count[i] = count[i] + 1;
                        }
                    }
                }
            });
            for (let i = 0; i < 6; i++) {
                if (count[i] != 0 )
                    events[i] = events[i] / count[i];
                else
                    events[i] = 3;
                events[i] = events[i] - 3;
            }
            for (let i = 0; i < 6; i++) {
                tmp = {
                    value: events[i],
                    date: listM[i]
                }
                d.push(tmp)
            }
        })
        return d;
    }

    getListMonth = () => {
        var listMonth = [0, 0, 0, 0, 0, 0];
        const data = this.createMonthData();
        for (let i = 0; i < 6; i++) {
            listMonth[i] = moment(data[i], 'YYYY-MM').format('MMM');
        }
        return listMonth;
    }

    render() {
        const Gradient = ({ index }) => (
            <Defs key={index}>
                <LinearGradient id={'gradient'} x1={'0%'} y={'0%'} x2={'0%'} y2={'100%'}>
                    <Stop offset={'0%'} stopColor={'#6E6E6E'} stopOpacity={0.7}/>
                    <Stop offset={'100%'} stopColor={'#78136E'} stopOpacity={0.7}/>
                </LinearGradient>
            </Defs>)

        const countData = {
            labels: this.getListMonth(),
            datasets: [{
                data: this.getCountData(),
                color: (opacity = 1) => `rgba(120, 19, 110, ${opacity})` // optional
            }]
        };

        var emotionData = this.getEmotionData();

        var placeData = this.getPlaceData();

        const emotionImage = [require('../assets/icons/1.png'), tmp = require('../assets/icons/2.png'), require('../assets/icons/3.png'), require('../assets/icons/4.png'),require('../assets/icons/5.png')]

        return (
            <View style={{ paddingTop: 55, flex: 1, height: '100%' }}>
                <ScrollView>
                    <CustomCard
                        title={'Event Counts'}>
                        <LineChart
                            data={countData}
                            width={screenWidth - 30}
                            height={180}
                            chartConfig={chartConfig}
                            bezier
                        />
                    </CustomCard>

                    <CustomCard
                        title={'Emotions'}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingVertical: 10}}>
                                {emotionImage.reverse().map(uri => (<Image source={uri} style={{width: 18, height: 18}} />))}
                            </View>
                            <AreaChart
                                style={{ height: 180, marginHorizontal: 10, flex: 1}}
                                data={emotionData}
                                contentInset={{ top: 20, bottom: 20 }}
                                svg={{ fill: 'url(#gradient)' }}
                                numberOfTicks={5}
                                curve={ shape.curveNatural }
                                yAccessor={ ({ item }) => item.value }
                                yMin={-2}
                                yMax={2}
                            >
                            <Grid/>
                            <Gradient/>
                            </AreaChart>
                        </View>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 10, marginLeft: 25}}>
                            {emotionData.map(item => (<Text style={{color: '#A977A4'}}>{moment(item.date, 'YYYY-MM').format('MMM')}</Text>))}
                        </View>
                    </CustomCard>

                    <CustomCard
                        title={'Places'}>
                        <FlatList
                            style={{ marginTop: 10}}
                            data={placeData}
                            numColumns={1}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                                        <Text style={{ 
                                            color: 'white', 
                                            backgroundColor: '#A977A4', 
                                            paddingHorizontal: 10, 
                                            paddingVertical: 3,
                                            borderRadius: 50,
                                            marginBottom: 5
                                        }}>
                                            {item}
                                        </Text>
                                    </View>
                                )
                            }}
                        />
                    </CustomCard>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({

})
