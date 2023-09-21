import './environment';

import App from './app';

import {
  DefaultRoute,
  ImportRoute,
  SongsRoute,
  ArtistRoute,
  AlbumRoute,
} from './routes';

const app = new App([
  new DefaultRoute(),
  new ImportRoute(),
  new SongsRoute(),
  new ArtistRoute(),
  new AlbumRoute(),
]);

app.listen();
