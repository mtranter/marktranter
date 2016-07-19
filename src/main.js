import {bootstrap} from 'aurelia-bootstrapper-webpack';
import 'bootstrap';
import {Credentials, DynamoDb} from './aws.js';
import {CvRepository, Repository} from './repository'
import storage from './storage.js'
import {AuthProvider, FbAuthProvider} from './auth-provider.js'

bootstrap(async (aurelia) => {
  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  //Uncomment the line below to enable animation.
  // aurelia.use.plugin('aurelia-animator-css');
  //if the css animator is enabled, add swap-order="after" to all router-view elements

  aurelia.container.registerSingleton(AuthProvider, FbAuthProvider)
  aurelia.container.registerHandler(DynamoDb, () => new AWS.DynamoDB());
  aurelia.container.registerTransient(Repository);
  aurelia.container.registerTransient(CvRepository);
  const rootElement = document.getElementById("app-root");
  rootElement.setAttribute('aurelia-app', '');

  await aurelia.start();
  aurelia.setRoot('app', rootElement);

  // if you would like your website to work offline (Service Worker),
  // install and enable the @easy-webpack/config-offline package in webpack.config.js and uncomment the following code:
  /*
  const offline = await System.import('offline-plugin/runtime');
  offline.install();
  */
});
