import config from './appConfig.js'

AWS.config.region = config.awsRegion;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.identityPoolId,
    Logins:{}
});

export class Credentials{
    setFbToken(token){
        AWS.config.credentials.params.Logins['graph.facebook.com'] = token; 
        return this;
    }
    refresh(){
        return new Promise((resolve) => {
            AWS.config.credentials.refresh(() => {
                console.log("credentials refreshed");
                console.log(AWS.config.credentials);
                resolve();
            });
        });
    }
    isGuest(){
        return AWS.config.credentials;
    }   
    
    static initialise(token){
        AWS.config.credentials.params.Logins['graph.facebook.com'] = token;     
        return new Promise((resolve, reject) => {
            if(AWS.config.credentials.needsRefresh()){
            AWS.config.credentials.get(() => {
                if(AWS.config.credentials.needsRefresh() && token){
                    resolve(Credentials.initialise())
                }else{
                    resolve();
                }
            });
            }else{
                resolve();
            }
        });
    }
}


export var DynamoDb = new AWS.DynamoDB({region: config.awsRegion});