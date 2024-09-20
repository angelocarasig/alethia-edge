import { Hono } from 'hono';

import { source as MangaDex } from './sources/Mangadex';
import { source as MangaNato } from './sources/Manganato';

const app = new Hono();

const routes = [
	{ path: '/mangadex', handler: MangaDex, source: 'MangaDex' },
	{ path: '/manganato', handler: MangaNato, source: 'Manganato' }
];

const sources: Array<{ source: string; path: string }> = [];

routes.forEach(({ path, handler, source }) => {
	app.route(path, handler);
	sources.push({ source: source, path: path });
});

app.get('/', (c) => {
	return c.json({
		repository: '@alethia/edge',
		sources
	});
});

export default app;
