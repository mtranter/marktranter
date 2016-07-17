import {inject} from 'aurelia-framework';
import Storage from './storage'
import {Credentials} from './aws.js'

@inject(Credentials, Storage)
export default class {
    constructor(credentials, storage){
        this.storage = storage;
        this.credentials = credentials;
    }
    adminLogin(){
        return new Promise((resolve, reject) => {
            FB.login(response => {
                if (response.authResponse) {
                    this.storage.set('authToken', response.authResponse.accessToken)
                    this.credentials.setFbToken(response.authResponse.accessToken).refresh().then(resolve);
                } else {
                    reject()
                }

            });
        });
    }
    isAdministrator(){ 
       // console.log(this.credentials.get());
        return new Promise(function(r){
            r(true)
        });
    }
}