import axios from 'axios';

import { BASE_URL, USER_AGENT } from '../constants';

import { MangadexChapterResponse } from '../types';
import { Chapter } from '../../../baseTypes';

export const getChapters = async (mangaId: string) => {
	const mangadexChapterToChapter = (input: MangadexChapterResponse): Chapter => {
		const chapterNumber = parseInt(input.attributes.chapter, 10);

    let scanlationGroupName = 'Mangadex';

    // Find the scanlation group relationship and extract its name
    const scanlationGroup = input.relationships.find(rel => rel.type === 'scanlation_group');
    if (scanlationGroup && scanlationGroup.attributes) {
      scanlationGroupName = scanlationGroup.attributes.name;
    }

		return {
			id: input.id,
			mangaId: mangaId,
			referenceId: input.id,
			pages: input.attributes.pages ?? 0,
			chapterNumber: isNaN(chapterNumber) ? 0 : chapterNumber,
			chapterTitle: input.attributes.title ?? '',
			author: scanlationGroupName,
			date: new Date(input.attributes.publishAt).toISOString()
		};
	};

	const ENDPOINT = `${BASE_URL}/manga/${mangaId}/feed`;
	let offset = 0;
	const limit = 100;
	let allChapters: Array<Chapter> = [];
	let total = 0;

	do {
		const response = await axios.get(ENDPOINT, {
			params: {
				limit: limit,
				offset: offset,
				translatedLanguage: ['en'],
				contentRating: ['safe', 'suggestive', 'erotica', 'pornographic'],
        order: {
          createdAt: 'desc',
          updatedAt: 'desc',
          publishAt: 'desc',
          readableAt: 'desc',
          volume: 'desc',
          chapter: 'desc',
        },
        includes: ['scanlation_group']
			},
			headers: {
				'User-Agent': USER_AGENT
			}
		});

		const raw = response.data.data as Array<MangadexChapterResponse>;
		const formatted = raw.map(mangadexChapterToChapter);

		allChapters = [...allChapters, ...formatted];

		total = response.data.total;
		offset += limit;
	} while (offset < total);

	return allChapters;
};
