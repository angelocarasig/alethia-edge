import { Hono } from 'hono';

import top_rated from './endpoints/top-rated';
import popular from './endpoints/popular';
import recent from './endpoints/recent';
import rising from './endpoints/rising';
import manga from './endpoints/manga';
import chapters from './endpoints/chapters';
import chapter from './endpoints/chapter';
import search from './endpoints/search';

const routes = [
	{ path: '/top-rated', handler: top_rated, name: 'Highest Rated' },
	{ path: '/popular', handler: popular, name: 'Popular' },
	{ path: '/rising', handler: rising, name: 'Popular New Titles' },
	{ path: '/recent', handler: recent, name: 'Recently Updated' }
];

export const source = new Hono();

source.get('/', (c) =>
	c.json({
		referer: '',
		routes: routes.map((route) => ({
			path: route.path,
			name: route.name
		}))
	})
);

source.get('/icon', async (c) => {
	const imgUrl = 'https://raw.githubusercontent.com/angelocarasig/alethia-edge/refs/heads/main/assets/mangadex.png';

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
source.get('/chapter/:id', chapter());

source.get('/search', search());
