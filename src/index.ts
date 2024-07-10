import { Hono } from 'hono';

import MangaDex from './sources/mangadex/routes';

const app = new Hono();

app.route('/mangadex', MangaDex);

app.get('/', (c) => {
	return c.text('Hello Hono!');
});

export default app;
