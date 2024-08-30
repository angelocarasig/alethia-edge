import { Context } from 'hono';
import axios from 'axios';

import { fetchChapters } from './chapters';
import { BASE_URL, MangadexMangaResponse, USER_AGENT } from '../constants';
import { parseMangaDexManga, parseMangaDexTags } from '../helpers/parser';

const manga = () => {
  return async (c: Context) => {
    const { id } = c.req.param();
    
    const endpoint = `${BASE_URL}/manga/${id}`;

    // Call getChapters and axios.get in parallel
    const [chapters, response] = await Promise.all([
      fetchChapters(id),

      axios.get(endpoint, {
        params: {
          includes: ['manga', 'cover_art', 'author', 'artist', 'tag']
        },
        headers: {
          'User-Agent': USER_AGENT
        }
      })
    ]);

    const raw = response.data.data as MangadexMangaResponse;
    const formatted = parseMangaDexManga(raw);
    const tags = parseMangaDexTags(raw);

    return c.json({ ...formatted, chapters, tags });
  };
};

export default manga;
