import './environment';

import App from './app';

import { DefaultRoute } from './routes';

const app = new App([
  new DefaultRoute(),
  // new AuthRoute()
]);

console.log(
  process.env.POSTGRES_DATABASE,
  process.env.POSTGRES_USERNAME,
  process.env.POSTGRES_PASSWORD
);

app.listen();
