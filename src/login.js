import AuthService from './authentication';
import {inject} from 'aurelia-framework';
@inject(AuthService)
export class Login{
	constructor(auth){
		this.auth = auth;   
	};

	heading = 'Login';

	async login(){
        	await this.auth.adminLogin();
	}
}