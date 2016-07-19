import {inject} from 'aurelia-framework';


export class AuthProvider{}

export class FbAuthProvider{
    
    getToken(){
        return new Promise((resolve, reject) => {
            FB.getLoginStatus(response => {
                if (response.status === 'connected') {
                    resolve(response.authResponse.accessToken);
                }else{
                    reject()
                }
            }) 
        });
    }

    get awsTokenType() { return 'graph.facebook.com'; }

    login(){
        return new Promise((resolve, reject) => {
            FB.login(response => {
                if (response.authResponse) {
                    resolve(response.authResponse.accessToken);
                } else {
                    reject()
                }
            });
        });
    }
}