import { Context } from 'hono';
import axios from 'axios';

import { BASE_URL, MangadexMangaResponse, USER_AGENT } from '../constants';
import { MangaToCollectionManga, parseMangaDexManga } from '../helpers/parser';

const endpoint = BASE_URL + '/manga';

const top_rated = () => {
	return async (c: Context) => {
		const { count = '60', page = '0' } = c.req.query();
		const _count = parseInt(count);
		const _page = parseInt(page);

		const response = await axios.get(endpoint, {
			params: {
				limit: _count,
				offset: _count * _page,

				status: ['ongoing', 'completed', 'hiatus', 'cancelled'],
				availableTranslatedLanguage: ['en'],
				publicationDemographic: ['shounen', 'shoujo', 'josei', 'seinen', 'none'],
				contentRating: ['safe', 'suggestive', 'erotica', 'pornographic'],
				includes: ['manga', 'cover_art', 'author', 'artist', 'tag'],

				// Sorting by rating to get the highest rated manga
				order: { rating: 'desc' },
			},
			headers: {
				'User-Agent': USER_AGENT
			}
		});

		const raw = response.data.data as Array<MangadexMangaResponse>;

		return c.json(raw.map(parseMangaDexManga).map(MangaToCollectionManga));
	};
};

export default top_rated;
