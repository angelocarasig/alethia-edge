import { Hono } from 'hono';

import recent from './endpoints/recent';
import top from './endpoints/top';
import manga from './endpoints/manga';
import chapters from './endpoints/chapters';
import chapter from './endpoints/chapter';
// import search from './endpoints/search';

export const source = new Hono();

const routes = [
	{ path: '/top', handler: top, name: 'Popular'},
	{ path: '/recent', handler: recent, name: 'Recently Updated' },
];

source.get('/', (c) =>
	c.json({
		routes: routes.map((route) => ({
			path: route.path,
			name: route.name
		}))
	})
);

routes.forEach((x) => source.get(x.path, x.handler()));

source.get('/manga', (c) => c.json(null));
source.get('/manga/:id', manga());

source.get('/chapters', (c) => c.json(null));
source.get('/chapters/:id', chapters());

source.get('/chapter', (c) => c.json(null));
source.get('/chapter/:id{.+}', chapter());

// source.get('/search', search());
