import './environment';

import App from './app';

import { DefaultRoute, ImportRoute } from './routes';

const app = new App([new DefaultRoute(), new ImportRoute()]);

app.listen();
