import './environment';

import App from './app';

import { DefaultRoute, ImportRoute, SongsRoute, ArtistRoute } from './routes';

const app = new App([
  new DefaultRoute(),
  new ImportRoute(),
  new SongsRoute(),
  new ArtistRoute(),
]);

app.listen();
