import { Hono } from 'hono';
import MangaDex from './sources/mangadex/routes';

const app = new Hono();

const routes = [
	{ path: '/mangadex', handler: MangaDex, source: 'mangadex' }
];

const sources: Array<String> = [];

routes.forEach(({ path, handler, source }) => {
	app.route(path, handler);
	sources.push(source);
});

app.get('/', (c) => {
	return c.json({
		repository: '@alethia/edge',
		sources,
	});
});

export default app;
