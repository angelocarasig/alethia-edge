import axios from "axios";

import { BASE_URL, USER_AGENT } from "../constants";
import { MangadexMangaResponse } from "../types";
import { mangadexObjectToMangaObject, mangaToCollectionManga } from "../shared";
import { CollectionManga } from "../../../baseTypes";

export const getRecent = async (count: number = 60, page: number = 0): Promise<Array<CollectionManga>> => {
	const ENDPOINT = BASE_URL + '/manga';

	const response = await axios.get(ENDPOINT, {
		params: {
			limit: count,
			offset: count * page,
			status: ['ongoing', 'completed', 'hiatus', 'cancelled'],
			availableTranslatedLanguage: ['en'],
			publicationDemographic: ['shounen', 'shoujo', 'josei', 'seinen', 'none'],
			contentRating: ['safe', 'suggestive', 'erotica', 'pornographic'],
			order: { latestUploadedChapter: 'desc' },
			includes: ['manga', 'cover_art', 'author', 'artist', 'tag']
		},
		headers: {
			'User-Agent': USER_AGENT
		}
	});

	const raw = response.data.data as Array<MangadexMangaResponse>;

	const formatted = raw
    .map(mangadexObjectToMangaObject)
    .map(mangaToCollectionManga);

	return formatted;
};
