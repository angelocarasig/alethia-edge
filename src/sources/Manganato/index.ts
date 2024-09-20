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
		referer: "https://chapmanganato.to/",
		routes: routes.map((route) => ({
			path: route.path,
			name: route.name
		})),
	})
);

source.get('/icon', async (c) => {
	const imgUrl = 'https://raw.githubusercontent.com/angelocarasig/alethia-edge/refs/heads/main/assets/manganato.png';

	try {
		const response = await fetch(imgUrl);

		if (!response.ok) {
			return c.text('Failed to fetch image from Imgur', 502);
		}

		const contentType = response.headers.get('Content-Type') || 'image/png';
		const imageBuffer = await response.arrayBuffer();

		return new Response(imageBuffer, {
			status: 200,
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=86400'
			}
		});
	} catch (error) {
		console.error('Error fetching image:', error);
		return c.text('Internal Server Error', 500);
	}
});

routes.forEach((x) => source.get(x.path, x.handler()));

source.get('/manga', (c) => c.json(null));
source.get('/manga/:id', manga());

source.get('/chapters', (c) => c.json(null));
source.get('/chapters/:id', chapters());

source.get('/chapter', (c) => c.json(null));
source.get('/chapter/:id{.+}', chapter());

// source.get('/search', search());
