
export class Index {
  configureRouter(config, router) {
    config.title = 'Administration';
    config.map([
      { route: ['', 'profile'], name: 'profile',      moduleId: './profile',      nav: true, title: 'Profile' },
      { route: ['skills'], name: 'skills',      moduleId: './skills',      nav: true, title: 'Skills' }
    ]);

    this.router = router;
  }
}