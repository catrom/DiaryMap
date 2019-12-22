import React from 'react';
import { View, Text } from 'react-native';
import { SideMenu, Drawer, Scene, Router, Actions, ActionConst } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Home from './Home';
import Map from './Map';
import Album from './Album';
import AppCalendar from './AppCalendar';
import Login from './Login';
import Register from './Register';
import AddEvent from './AddEvent';
import Event from './Event'
import Profile from './Profile'
import Statistic from './Statistic'
import AppDrawer from './ui/Drawer';

const TabIcon = ({ selected, title, iconName }) => {
    const color = selected ? '#510B4A' : '#C4C4C4';
    return (
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }}>
            <Icon style={{ color: color }} name={iconName || "circle"} size={25} />
            {/* <Text style={{color: color, fontSize: 12}}>{title}</Text> */}
        </View>
    );
};

const DrawerIcon = () => {
    return (
        <View style={{ flexDirection: "column", alignSelf: 'flex-end', justifyContent: 'space-around', marginTop: 10 }}>
            <Icon name='bars' size={30} color='white' onPress={() => {}} />
        </View>
    )
}

const AddIcon = () => {
    return (
        <View style={{ flexDirection: "column", alignSelf: 'flex-end', justifyContent: 'space-around', marginTop: 10 }}>
            <Icon name='plus-circle' size={35} color='white' onPress={() => Actions.add()} />
        </View>
    )
}

const styles = {
    navigationBarStyle: {
        backgroundColor: '#78136E',
        justifyContent: 'flex-start'
    },
    titleStyle: {
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center'
    }
}

const { navigationBarStyle, titleStyle } = styles;

const AppRouter = () => {
    return (
        <Router
            navigationBarStyle={navigationBarStyle}
            titleStyle={titleStyle} >
            <Scene key='auth' tabBarStyle={{ backgroundColor: '#FFFFFF', elevation: 25 }} initial type={ActionConst.RESET} lazy 
            backButtonTextStyle = {{color:'#fff'}} 
            barButtonIconStyle={{ tintColor: '#fff' }} >
                <Scene
                    key="login"
                    component={Login}
                    title="LOGIN"
                    initial
                />
                <Scene
                    key='register'
                    component={Register}
                    title='REGISTER'
                />
            </Scene>

            <Scene key='tabs' tabs tabBarStyle={{ backgroundColor: '#FFFFFF', elevation: 25 }} type={ActionConst.RESET} lazy>
                <Scene
                    key='profile'
                    component={Profile}
                    iconName='user-circle'
                    title='PROFILE'
                    icon={TabIcon}
                />
                <Scene
                    key="home"
                    component={Home}
                    iconName='home'
                    title="DISCOVERY"
                    icon={TabIcon}
                />
                <Scene
                    key='map'
                    component={Map}
                    title='MAP'
                    iconName='map-marked-alt'
                    icon={TabIcon}
                    initial
                />
                <Scene
                    key='album'
                    component={Album}
                    title='ALBUM'
                    iconName='images'
                    icon={TabIcon}
                />
                <Scene
                    key='calendar'
                    component={AppCalendar}
                    title='CALENDAR'
                    iconName='calendar-alt'
                    icon={TabIcon}
                />
                <Scene
                    key='statistic'
                    component={Statistic}
                    title='STATISTIC'
                    iconName='chart-pie'
                    icon={TabIcon}
                />

            </Scene>
            <Scene
                key='add'
                component={AddEvent}
                title='ADD EVENT'
                backButtonTextStyle = {{color:'#fff'}} 
                leftButtonIconStyle ={{ tintColor: '#fff' }}
            />
            <Scene
                key='event'
                component={Event}
                title='MEMORY'
                backButtonTextStyle = {{color:'#fff'}} 
                leftButtonIconStyle ={{ tintColor: '#fff' }}
            />

        </Router>
    )
}

export default AppRouter;
