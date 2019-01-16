import React, { Component } from 'react';
import firebase from 'firebase'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { ProgressDialog } from 'react-native-simple-dialogs';
import ImagePicker from 'react-native-image-picker';

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

            progressVisible: false
        }
    }

    openImagePicker = () => {
        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                alert('User cancelled image picker');
            } else if (response.error) {
                alert('ImagePicker Error: ', response.error);
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
                }).then(function () {
                    alert('User\'s avatar changed');
                }).catch(function (error) {
                    alert('User\'s avatar error: \n' + error);
                });

            })
    }

    render() {
        return (
            <View style={styles.container}>
                <ProgressDialog
                    visible={this.state.progressVisible}
                    title="Processing"
                    message="Please wait..."
                />
                <View style={styles.header}></View>
                <TouchableOpacity style={styles.avatarContainer} onPress={this.openImagePicker}>
                    <Image style={styles.avatar} source={{ uri: this.state.avatar }} />
                </TouchableOpacity>
                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <Text style={styles.name}>{this.state.name}</Text>
                        <Text style={styles.info}>{this.state.email}</Text>
                        <Text style={styles.description}></Text>

                        <TouchableOpacity style={styles.buttonContainer}>
                            <Text>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#00BFFF",
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
        borderColor: "#d13aff",
        backgroundColor: 'white',

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
        color: "#00BFFF",
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
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
        backgroundColor: "#00BFFF",
    },
});