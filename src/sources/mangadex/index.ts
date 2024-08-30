import { Hono } from 'hono';

import recent from './endpoints/recent';
import rising from './endpoints/rising';
import manga from './endpoints/manga';
import chapters from './endpoints/chapters';
import chapter from './endpoints/chapter';
import search from './endpoints/search';

export const source = new Hono();

const routes = [
	{ path: '/recent', handler: recent },
	{ path: '/rising', handler: rising }
];

source.get('/', (c) =>
	c.json({
		routes: routes.map((route) => route.path)
	})
);

routes.forEach(x => source.get(x.path, x.handler()));

source.get('/manga', (c) => c.json(null));
source.get('/manga/:id', manga());

source.get('/chapters', (c) => c.json(null));
source.get('/chapters/:id', chapters());

source.get('/chapter', (c) => c.json(null));
source.get('/chapter/:id', chapter());

source.get('/search', search());
