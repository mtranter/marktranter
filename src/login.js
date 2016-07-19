import {AuthService} from './aws';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(AuthService, Router)
export class Login{
	redirectUrl = ''
	constructor(auth, router){
		this.auth = auth; 
		this.router = router;  
	};

	heading = 'Login';

	async login(){
        	await this.auth.loginAdmin();
			this.router.navigate(this.redirectUrl);
	}

	activate(params){
		this.redirectUrl = params.redirect || '';
	}
}