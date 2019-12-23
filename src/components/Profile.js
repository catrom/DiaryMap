import React, { Component } from 'react';
import firebase from 'firebase'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { ProgressDialog, ConfirmDialog } from 'react-native-simple-dialogs';
import ImagePicker from 'react-native-image-picker';
import { USERNAME, PASSWORD } from './Regexs';
import {Actions} from 'react-native-router-flux';
import Toast, {DURATION} from 'react-native-easy-toast';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: firebase.auth().currentUser.uid,
            avatar: firebase.auth().currentUser.photoURL,
            name: firebase.auth().currentUser.displayName,
            email: firebase.auth().currentUser.email,

            progressVisible: false,

            usrDialogVisible: false,
            passDialogVisible: false,
            logoutDialogVisible: false,

            newUsername: '',
            newPassword: '',
            newRePassword: '',
        }
    }

    openImagePicker = () => {
        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                
            } else if (response.error) {
                //alert('ImagePicker Error: ', response.error);
                this.refs.toast.show(<View><Text>ImagePicker Error: + {response.error}</Text></View>, 1000)
            } else {
                return new Promise((resolve, reject) => {
                    var up = this.uploadImage(response.path, 'image/jpeg', this.state.uid + '.png');
                    up.then(() => {
                        this.setState({ progressVisible: false })
                    });
                })
            }
        })
    }

    uploadImage = (uri, mime = 'image/jpeg', name) => {
        this.setState({ progressVisible: true });

        let imgUri = uri; let uploadBlob = null;
        const uploadUri = Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
        const imageRef = firebase.storage().ref('avatar/' + name)

        return fs.readFile(uploadUri, 'base64')
            .then(data => {
                return Blob.build(data, { type: `${mime};BASE64` });
            })
            .then(blob => {
                uploadBlob = blob;
                return imageRef.put(blob, { contentType: mime, name: name });
            })
            .then(() => {
                uploadBlob.close()
                return imageRef.getDownloadURL();
            })
            .then(url => {
                this.setState({ avatar: url });
                firebase.auth().currentUser.updateProfile({
                    photoURL: url
                }).then(() => {
                    //alert('User\'s avatar changed');
                    this.refs.toast.show('User\'s avatar changed', 1000);
                }).catch((error) => {
                    //alert('User\'s avatar error: \n' + error);
                    this.refs.toast.show(<View><Text>User's avatar error: + {error}</Text></View>, 1000)
                });

            })
    }

    editUsername = () => {
        this.setState({ usrDialogVisible: true })
    }

    confirmEditUsername = () => {
        // check username regex -> update new username here
        if (this.state.newUsername == '') {
            this.refs.toast.show('Please enter the new username!', 1000)
            return
        } 
        else if (USERNAME.test(this.state.newUsername) == false) {
            this.refs.toast.show('Username invalid. Username does not contains numbers and any special characters!', 1000)
            return
        }
        else {
            return new Promise((resolve, reject) => {
                var update = firebase.auth().currentUser.updateProfile({
                    displayName: this.state.newUsername,
                })
                update.then(() => {
                    this.setState({
                        name: this.state.newUsername,
                        newUsername: ''
                    })

                    this.setState({
                        usrDialogVisible: false
                    })
                }).then(() => {
                    this.refs.toast.show('Update username successfully!', 1000)
                });
            })
        }
    }

    changePassword = () => {
        this.setState({ passDialogVisible: true })
    }

    confirmChangePassword = () => {
        // check pass + re-pass regex -> update new password here
        if (this.state.newPassword == '') {
            this.refs.toast.show('Please enter new password', 1000)
            return
        }
        else if (PASSWORD.test(this.state.newPassword) == false) {
            this.refs.toast.show('Password invalid. Password must uses characters within [a-zA-Z0-9] and at least 6.', 1000)
            return
        }
        else if (this.state.newRePassword == '') {
            this.refs.toast.show('Please reenter your new password', 1000)
            return
        }        
        else if (this.state.newPassword != this.state.newRePassword) {
            this.refs.toast.show('Repassword does not matched. Please check your repassword.', 1000)
            return
        }
        else {
            return new Promise((resolve, reject) => {
                var update = firebase.auth().currentUser.updatePassword(this.state.newPassword)
                update.then(() => {
                    this.setState({
                        newPassword: '',
                        newRePassword: '',
                    })

                    this.setState({
                        passDialogVisible: false
                    })
                }).then(() => {
                    this.refs.toast.show('Update password successfully!', 1000)
                });
            })
        }        
    }

    logout = () => {
        this.setState({ logoutDialogVisible: true })
    }

    confirmLogOut = () => {
        return new Promise((resolve, reject) => {
            var logout = firebase.auth().signOut()
            logout.then(() => {
                this.setState({
                    logoutDialogVisible: false
                })

                Actions.auth()
            }).then(() => {
                // do nothing
            });
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Toast ref="toast" 
                    textStyle={{color:'white', fontSize:16}} 
                    style={{backgroundColor:'black', borderRadius:50, opacity:0.8}}
                />
                <ScrollView>
                    <ProgressDialog
                        visible={this.state.progressVisible}
                        title="Changing avatar"
                        message="Please wait..."
                    />
                    <ConfirmDialog
                        title='Change username'
                        visible={this.state.usrDialogVisible}
                        onTouchOutside={() => this.setState({ usrDialogVisible: false })}
                        positiveButton={{
                            title: "CHANGE",
                            onPress: this.confirmEditUsername
                        }}
                        negativeButton={{
                            title: "CANCEL",
                            onPress: () => this.setState({ usrDialogVisible: false })
                        }}>
                        <TextInput 
                            style={styles.textInput}
                            placeholder={'New username...'} 
                            onChangeText={(newUsername) => {this.setState({newUsername: newUsername})}}    
                        />
                    </ConfirmDialog>
                    <ConfirmDialog
                        title="Change password"
                        visible={this.state.passDialogVisible}
                        onTouchOutside={() => this.setState({ passDialogVisible: false })}
                        positiveButton={{
                            title: "CHANGE PASSWORD",
                            onPress: this.confirmChangePassword
                        }}
                        negativeButton={{
                            title: "CANCEL",
                            onPress: () => this.setState({ passDialogVisible: false })
                        }}>
                        <TextInput 
                        style={styles.textInput}
                            placeholder={'New password...'} 
                            secureTextEntry={true}
                            onChangeText={(newPassword) => {this.setState({newPassword: newPassword})}}
                        />
                        <TextInput 
                            style={styles.textInput}
                            placeholder={'Re-enter new password...'} 
                            secureTextEntry={true}
                            onChangeText={(newRePassword) => {this.setState({newRePassword: newRePassword})}}
                        />
                    </ConfirmDialog>
                    <ConfirmDialog
                        title="Do you want to Logout?"
                        visible={this.state.logoutDialogVisible}
                        onTouchOutside={() => this.setState({ logoutDialogVisible: false })}
                        positiveButton={{
                            title: "LOG OUT",
                            onPress: this.confirmLogOut
                        }}
                        negativeButton={{
                            title: "CANCEL",
                            onPress: () => this.setState({ logoutDialogVisible: false })
                        }}>
                    </ConfirmDialog>
                    <View style={styles.header}></View>
                    <TouchableOpacity style={styles.avatarContainer} onPress={this.openImagePicker}>
                        <Image style={styles.avatar} source={{ uri: this.state.avatar }} />
                    </TouchableOpacity>
                    <View style={styles.body}>
                        <View style={styles.bodyContent}>
                            <Text style={styles.name}>{this.state.name}</Text>
                            <Text style={styles.info}>{this.state.email}</Text>
                            <Text style={styles.description}></Text>

                            <TouchableOpacity style={styles.buttonContainer} onPress={this.editUsername}>
                                <Text style={styles.textInButton}>Edit Username</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonContainer} onPress={this.changePassword}>
                                <Text style={styles.textInButton}>Change Password</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonContainer2} onPress={this.logout}>
                                <Text style={styles.textInButton2}>LOG OUT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#A977A4",
        height: 200,
    },
    avatarContainer: {
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 130
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "#78136E",
        backgroundColor: 'white',

    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 2,
        marginBottom: 2
    },
    name: {
        fontSize: 22,
        color: "#FFFFFF",
        fontWeight: '600',
    },
    body: {
        marginTop: 40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
    },
    name: {
        fontSize: 28,
        color: "#696969",
        fontWeight: "600"
    },
    info: {
        fontSize: 16,
        color: "#78136E",
        marginTop: 10
    },
    description: {
        fontSize: 16,
        color: "#696969",
        marginTop: 10,
        textAlign: 'center'
    },
    buttonContainer: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        width: 250,
        backgroundColor: "#fff",
        color: 'white',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#78136E',
    },
    buttonContainer2: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        backgroundColor: "#fff",
        color: 'white',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#B80000',
    },
    textInButton: {
        fontSize: 16,
        color: '#78136E',
    },
    textInButton2: {
        fontSize: 16,
        color: '#B80000',
    }
});