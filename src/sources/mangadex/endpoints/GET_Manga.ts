import axios from 'axios';

import { getChapters } from './GET_Chapters';

import { mangadexObjectToMangaObject, mangadexObjectToTags } from '../shared';
import { BASE_URL, USER_AGENT } from '../constants';
import { MangadexMangaResponse } from '../types';
import { DisplayManga } from '../../../baseTypes';

export const getManga = async (referenceId: string): Promise<DisplayManga> => {
	const ENDPOINT = `${BASE_URL}/manga/${referenceId}`;

	// Call getChapters and axios.get in parallel
	const [chapters, response] = await Promise.all([
		getChapters(referenceId),
		axios.get(ENDPOINT, {
			params: {
				includes: ['manga', 'cover_art', 'author', 'artist', 'tag']
			},
			headers: {
				'User-Agent': USER_AGENT
			}
		})
	]);

	const raw = response.data.data as MangadexMangaResponse;
	const formatted = mangadexObjectToMangaObject(raw);
	const tags = mangadexObjectToTags(raw);
	const groups = [{ mangaId: formatted.id, name: 'Default' }];

	return { ...formatted, chapters, groups, tags };
};
