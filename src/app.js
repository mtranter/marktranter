import {inject} from 'aurelia-framework'
import {Redirect} from 'aurelia-router';
import AuthService from './authentication.js'
import config from './appConfig.js'
import storage from './storage.js'

export class App {
  configureRouter(config, router) {
    config.title = 'Mark Tranter';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: './welcome',      nav: true, title: 'Welcome' },
      { route: 'login',         name: 'login',        moduleId: './login',        nav: true, title: 'Login' },
      { route: 'admin',  name: 'admin', moduleId: './admin/index', nav: true, title: '', settings: { roles: ['admin'] } }
    ]);

    this.router = router;
  }
}

@inject(AuthService, config, storage)
class AuthorizeStep {
  constructor(authService, config, storage){
    this.requiredRole = config.adminRoleArn
    this.authService = authService;
    this.storage = storage;
  }

  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles && i.config.settings.roles.indexOf('admin') !== -1)) {
      const cancel = function(){return next.cancel(new Redirect('login')); }
      var token = this.storage.get('authToken');
      if(token){
        var creds = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.identityPoolId,
            Logins:{
                "graph.facebook.com": token
            },
            RoleArn: this.requiredRole
        });
        creds.get(function(){
          if(!creds.expired){
              AWS.config.credentials = creds;
              next();
          }else{
            return cancel();
          }
        });
      }else{
        return cancel();
      }
    }
    return next();
  }
}