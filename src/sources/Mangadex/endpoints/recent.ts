import { Context } from 'hono';
import axios from 'axios';

import { BASE_URL, MangadexMangaResponse, USER_AGENT } from '../constants';
import { MangaToCollectionManga, parseMangaDexManga } from '../helpers/parser';

const endpoint = BASE_URL + '/manga';

const recent = () => {
	return async (c: Context) => {
		const { count = '60', page = '0' } = c.req.query();
		const _count = parseInt(count);
		const _page = parseInt(page);

		const response = await axios.get(endpoint, {
			params: {
				limit: _count,
				offset: _count * _page,

				availableTranslatedLanguage: ['en'],
				publicationDemographic: ['shounen', 'shoujo', 'josei', 'seinen', 'none'],
				contentRating: ['safe', 'suggestive', 'erotica', 'pornographic'],
				status: ['ongoing', 'completed', 'hiatus', 'cancelled'],
				includes: ['manga', 'cover_art'],
				order: { latestUploadedChapter: 'desc' }
			},
			headers: {
				'User-Agent': USER_AGENT
			}
		});

		const raw = response.data.data as Array<MangadexMangaResponse>;

		return c.json(raw.map(parseMangaDexManga).map(MangaToCollectionManga));
	};
};

export default recent;
