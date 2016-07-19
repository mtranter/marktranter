import {inject} from 'aurelia-framework'
import {Redirect} from 'aurelia-router';
import {AuthService} from './aws.js'
import config from './appConfig.js'
import storage from './storage.js'


@inject(AuthService)
export class App {
  constructor(authService){
    this.authService = authService;
  }
  async configureRouter(config, router) {
    await this.authService.authorizeAdminWithFallback();
    config.title = 'Mark Tranter';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: './welcome',      nav: true, title: 'Welcome' },
      { route: 'login',         name: 'login',        moduleId: './login',        nav: true, title: 'Login' },
      { route: 'admin',  name: 'admin', moduleId: './admin/index', nav: true, title: '', settings: { roles: ['admin'] } }
    ]);

    this.router = router;
  }
  canActivate(){
    console.log("in can activate");
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
      const cancel = function(){return next.cancel(new Redirect('login?redirect=' + navigationInstruction.fragment)); }
      if(!this.authService.isAdmin){
        return this.authService.authorizeAdmin().then(next).catch(cancel);
      }
    }
    return next();
  }
}