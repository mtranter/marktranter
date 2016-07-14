import {AuthorizeStep} from 'aurelia-auth';

export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    //config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: './welcome',      nav: true, title: 'Welcome' },
      { route: 'login',         name: 'login',        moduleId: './login',        nav: true, title: 'Login' },
      { route: 'child-router',  name: 'child-router', moduleId: './child-router', nav: true, title: 'Child Router' }
    ]);

    this.router = router;
  }
}
