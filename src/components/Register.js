import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from 'firebase'
import { PASSWORD, EMAIL, USERNAME } from './Regexs'
import Toast, {DURATION} from 'react-native-easy-toast';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            repassword: '',
            usernameValid: false,
            emailValid: false,
            passwordValid: false,
            repasswordValid: false
        }
    }

    validate(type, value) {
        if (type == "username") {
            this.setState({ username: value })
            if (USERNAME.test(value))
                this.setState({ usernameValid: true })
            else
                this.setState({ usernameValid: false })
        }
        else if (type == "email") {
            this.setState({ email: value })
            if (EMAIL.test(value))
                this.setState({ emailValid: true })
            else
                this.setState({ emailValid: false })
        }
        else if (type == "password") {
            this.setState({ password: value })
            if (PASSWORD.test(value))
                this.setState({ passwordValid: true })
            else
                this.setState({ passwordValid: false })
        }
        else if (type == "repassword") {
            this.setState({ repassword: value })
            if (value == this.state.password)
                this.setState({ repasswordValid: true })
            else
                this.setState({ repasswordValid: false })
        }
    }

    _register() {
        if (this.state.emailValid && this.state.usernameValid && this.state.passwordValid && this.state.repasswordValid) {
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(() => {
                    var user = firebase.auth().currentUser

                    // Send verification email
                    if (user) {
                        user.sendEmailVerification().then(function () {
                            Alert.alert(
                                'SIGNUP SUCCESSFUL',
                                'An email is sent to your email address. Please verify it before login.'
                            )
                        }).catch(function (error) {
                            // An error happened.
                        });
                    }
                    
                    // Update displayName
                    if (user) {
                        user.updateProfile({
                            displayName: this.state.username,
                        }).then(function () {
                            // Do nothing
                        }).catch(function (error) {
                            this.refs.toast.show('Cannot update your username!', 1000)
                        });
                    }
                }).catch(function (error) {
                    Alert.alert(
                        'SIGNUP FAILED',
                        'This email address is using by another user.'
                    )
                    return
                });
        }
        else {
            if (this.state.username == '') {
                this.refs.toast.show('Please enter your username!', 1000)
            }
            else if (!this.state.usernameValid) {
                this.refs.toast.show('Username invalid. Username does not contains numbers and any special characters!', 1000)
            }
            else if (this.state.email == '') {
                this.refs.toast.show('Please enter your email!', 1000)
            }
            else if (!this.state.emailValid) {
                this.refs.toast.show('Email invalid. Please check your email format.', 1000)
            }
            else if (this.state.password == '') {
                this.refs.toast.show('Please enter your password!', 1000)
            }
            else if (!this.state.passwordValid) {
                this.refs.toast.show('Password invalid. Password must uses characters within [a-zA-Z0-9] and at least 6!', 1000)
            }
            else if (this.state.repassword == '') {
                this.refs.toast.show('Please reenter your password!', 1000)
            }
            else if (!this.state.repasswordValid) {
                this.refs.toast.show('Repassword does not matched. Please check your repassword!', 1000)
            }
        }
    }

    render() {
        return (
            <ImageBackground source={require('../assets/background.png')} style={styles.container}>
                <Toast ref="toast" 
                    textStyle={{color:'white', fontSize:16}} 
                    style={{backgroundColor:'black', borderRadius:50, opacity:0.8}}
                />
                <View>
                    <Image source={require('../assets/logo2.png')} style={{ height: 130, resizeMode: 'stretch', alignSelf: 'center', marginVertical: 30 }} />
                    <View style={styles.inputContainer}>
                        <Icon style={{ color: 'white', marginHorizontal: 8 }} name={'user-circle'} size={25} />
                        <TextInput
                            style={styles.textInput}
                            placeholder='Username'
                            placeholderTextColor='white'
                            onChangeText={(username) => { this.validate("username", username) }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Icon style={{ color: 'white', marginHorizontal: 8 }} name={'envelope'} size={25} />
                        <TextInput
                            style={styles.textInput}
                            placeholder='Email'
                            placeholderTextColor='white'
                            onChangeText={(email) => { this.validate("email", email) }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Icon style={{ color: 'white', marginHorizontal: 12 }} name={'unlock-alt'} size={25} />
                        <TextInput
                            style={styles.textInput}
                            placeholder='Password'
                            placeholderTextColor='white'
                            secureTextEntry={true}
                            onChangeText={(password) => { this.validate("password", password) }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Icon style={{ color: 'white', marginHorizontal: 12 }} name={'unlock-alt'} size={25} />
                        <TextInput
                            style={styles.textInput}
                            placeholder='Re-password'
                            placeholderTextColor='white'
                            secureTextEntry={true}
                            onChangeText={(repassword) => { this.validate("repassword", repassword) }}
                        />
                    </View>
                    <TouchableOpacity text='SIGNUP' style={styles.buttonContainer} onPress={() => { this._register() }}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingBottom: 60,
        backgroundColor: '#26d6f2',
        flex: 1, padding: 35,
        justifyContent: 'center',
        //alignItems: 'center'
    },
    inputContainer: {
        borderColor: 'white',
        borderRadius: 50,
        borderWidth: 2,
        padding: 3,
        alignItems: 'center',
        height: 50,
        flexDirection: 'row',
        margin: 5
    },
    textInput: {
        //borderBottomWidth: 2,
        borderBottomColor: 'white',
        flex: 1,
        color: 'white',
        fontSize: 16
    },
    buttonContainer: {
        borderColor: 'white',
        borderRadius: 50,
        borderWidth: 2,
        padding: 3,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        margin: 5,
        backgroundColor: '#8C007E',
    },
    buttonText: {
        fontSize: 20,
        color: 'white'
    }
})

export default Register;
