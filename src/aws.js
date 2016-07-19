import config from './appConfig.js'
import storage from './storage.js'
import {inject} from 'aurelia-framework'
import {AuthProvider} from './auth-provider'

AWS.config.region = config.awsRegion;

@inject(AuthProvider, storage)
export class AuthService{
    adminCreds = null
    constructor(authProvider, storage){
        this.authProvider = authProvider;
        this.storage = storage;
    }
    refresh(){
        return new Promise((resolve) => {
            AWS.config.credentials.refresh(resolve);
        });
    }
    authorizeGuest(){
        const creds = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: config.identityPoolId,
                        Logins:{}
                    });
        return this._getCredentials(creds).then(this._setCreds.bind(this));
    }
    authorizeAdmin(){
        return this.authProvider.getToken().then(this._authorizeTokenAsAdmin.bind(this)).then(this._setCreds.bind(this));
    }
    authorizeAdminWithFallback(){
        return this.authorizeAdmin().catch(this.authorizeGuest.bind(this));
    }
    loginAdmin(){
        return this.authProvider.login().then(this._authorizeTokenAsAdmin.bind(this)).then(this._setCreds.bind(this));
    }
    get isAdmin(){
        return this.adminCreds != null && !this.adminCreds.expired;
    }
    _setCreds(creds){
        AWS.config.credentials = creds;
    }
    _authorizeTokenAsAdmin(token){
        const that = this;
        return new Promise((resolve, reject) => {
            const creds = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: config.identityPoolId,
                ArnRole: config.adminRoleArn,
                Logins:{
                    [this.authProvider.awsTokenType]: token
                }
            });
            that._getCredentials(creds).then(c => {
                if(creds.expired) {
                    this.adminCreds = null;
                    reject();
                }else{
                    this.adminCreds = creds;
                    resolve(creds);
                } 
            }).catch(reject);
        });
    }
    _getCredentials(creds){
        return new Promise((resolve, reject) => {
            creds.get(() => {
                if(creds.expired){
                    reject()
                }else{
                    resolve(creds);
                }
            });
        });
    }
}


export var DynamoDb = new AWS.DynamoDB({region: config.awsRegion});