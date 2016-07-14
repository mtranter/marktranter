import {AuthService} from 'aurelia-auth';
import {inject} from 'aurelia-framework';
@inject(AuthService )

export class Login{
	constructor(auth){
		this.auth = auth;
	};

	heading = 'Login';
	
    bind(){
        FB.getLoginStatus(function(response) {

            console.log('You are now logged in.');

            // Add the Facebook access token to the Cognito credentials login map.
            AWS.config.region = 'us-east-1'
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-1:4f4dc1d4-325c-46aa-bee4-d06ba8bac7f5',
                Logins: {
                    'graph.facebook.com': response.authResponse.accessToken
                }
            });

            // Obtain AWS credentials
            AWS.config.credentials.get(function(d){
                console.log(AWS.config.credentials)
                    var params = {
                        TableName: "Logins",
                        Item: {
                            "sessionToken": {"S": AWS.config.credentials.sessionToken}
                        }
                    };
                var dynamodb = new AWS.DynamoDB();
                dynamodb.putItem(params, function(){
                    console.log(arguments);
                })
            });

        });
    }

	login(){

        FB.login(function (response) {

        // Check if the user logged in successfully.
        if (response.authResponse) {

            console.log('You are now logged in.');

            // Add the Facebook access token to the Cognito credentials login map.
            AWS.config.region = 'us-east-1'
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-1:4f4dc1d4-325c-46aa-bee4-d06ba8bac7f5',
                Logins: {
                    'graph.facebook.com': response.authResponse.accessToken
                }
            });

            // Obtain AWS credentials
            AWS.config.credentials.get(function(d){
                console.log(AWS.config.credentials)
                    var params = {
                        TableName: "Logins",
                        Item: {
                            "sessionToken": AWS.config.credentials.sessionToken
                        }
                    };
                var dynamodb = new AWS.DynamoDB();
                dynamodb.putItem(params, function(){
                    console.log(arguments);
                })
            });

        } else {
            console.log('There was a problem logging you in.');
        }

        });

	}
}