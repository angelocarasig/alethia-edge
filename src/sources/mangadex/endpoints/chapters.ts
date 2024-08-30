import { Context } from 'hono';
import axios from 'axios';

import { BASE_URL, USER_AGENT, MangadexChapterResponse } from '../constants';
import { parseMangaDexChapter } from '../helpers/parser';
import { Chapter } from '@illithia/types/src/types/chapter';

// Core function that can be used in both the route handler and manga.ts
export const fetchChapters = async (id: string): Promise<Array<Chapter>> => {
  const endpoint = `${BASE_URL}/manga/${id}/feed`;

  let offset = 0;
  const limit = 100;
  let allChapters: Array<Chapter> = [];
  let total = 0;

  do {
    const response = await axios.get(endpoint, {
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
        includes: ['scanlation_group'],
      },
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    const raw = response.data.data as Array<MangadexChapterResponse>;
    const formatted = raw.map(chapter => parseMangaDexChapter(id, chapter));

    allChapters = [...allChapters, ...formatted];

    total = response.data.total;
    offset += limit;
  } while (offset < total);

  return allChapters;
};

// Route handler for Hono
const chapters = () => {
  return async (c: Context) => {
    const { id } = c.req.param();
    const allChapters = await fetchChapters(id);
    return c.json(allChapters);
  };
};

export default chapters;
