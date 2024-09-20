import { Context } from 'hono';
import axios from 'axios';

import { BASE_URL, USER_AGENT, MangadexMangaResponse } from '../constants';
import { MangaToCollectionManga, parseMangaDexManga } from '../helpers/parser';
import { CollectionManga } from '@alethia/types';

const endpoint = BASE_URL + '/manga';

const fetchSearchResults = async (title: string): Promise<Array<CollectionManga>> => {
	const response = await axios.get(endpoint, {
		params: {
			limit: 100,
			status: ['ongoing', 'completed', 'hiatus', 'cancelled'],
			availableTranslatedLanguage: ['en'],
			publicationDemographic: ['shounen', 'shoujo', 'josei', 'seinen', 'none'],
			contentRating: ['safe', 'suggestive', 'erotica', 'pornographic'],
			includes: ['manga', 'cover_art', 'author', 'artist', 'tag'],

			title: title,
			order: { relevance: 'desc' }
		},
		headers: {
			'User-Agent': USER_AGENT
		}
	});

	const raw = response.data.data as Array<MangadexMangaResponse>;

	return raw.map(parseMangaDexManga).map(MangaToCollectionManga);
};

// Hono route handler
const search = () => {
	return async (c: Context) => {
		const title = c.req.query('title') || '';
		if (!title) {
			return c.json({ error: 'Title parameter is required' }, 400);
		}

		const results = await fetchSearchResults(title);
		return c.json(results);
	};
};

export default search;
