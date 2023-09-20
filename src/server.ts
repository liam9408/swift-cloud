import './environment';

import App from './app';

import { DefaultRoute, ImportRoute, SongsRoute } from './routes';

const app = new App([new DefaultRoute(), new ImportRoute(), new SongsRoute()]);

app.listen();
