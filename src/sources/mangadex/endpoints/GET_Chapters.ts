import axios from 'axios';

import { BASE_URL, USER_AGENT } from '../constants';

import { MangadexChapterResponse } from '../types';
import { Chapter } from '../../../baseTypes';

export const getChapters = async (mangaId: string) => {
  const mangadexChapterToChapter = (input: MangadexChapterResponse): Chapter => {
    return {
      id: input.id,
      mangaId: mangaId,
      referenceId: input.id,
  
      pages: input.attributes.pages ?? 0,
      chapterNumber: parseInt(input.attributes.chapter, 10) ?? 0,
      chapterTitle: input.attributes.title ?? '',
  
      author: 'Mangadex', // TODO: Get actual scanlation group
  
      date: new Date(input.attributes.publishAt).toISOString()
    };
  };

	const ENDPOINT = `${BASE_URL}/manga/${mangaId}/feed`;

	const response = await axios.get(ENDPOINT, {
		params: {
			'translatedLanguage[]': 'en'
		},
		headers: {
			'User-Agent': USER_AGENT
		}
	});

	const raw = response.data.data as Array<MangadexChapterResponse>;
	const formatted = raw
		.map(mangadexChapterToChapter)
		.sort((a, b) => b.chapterNumber - a.chapterNumber);
	return formatted;
};
