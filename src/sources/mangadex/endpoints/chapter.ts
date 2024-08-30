import { Context } from 'hono';
import axios from 'axios';

import { BASE_URL, USER_AGENT } from '../constants';

export const fetchChapterPages = async (chapterId: string, quality = 'data-saver'): Promise<string[]> => {
  const endpoint = `${BASE_URL}/at-home/server/${chapterId}`;

  const response = await axios.get(endpoint, { headers: { 'User-Agent': USER_AGENT } });
  console.log(response);
  
  const { baseUrl, chapter } = response.data;
  const { hash } = chapter;

  const filenames = quality === 'data' ? chapter.data : chapter.dataSaver;

  return filenames.map((filename: string) => `${baseUrl}/${quality}/${hash}/${filename}`);
};

// Hono route handler
const chapter = () => {
  return async (c: Context) => {
    const { id } = c.req.param();
    // const quality = c.req.query('quality') || 'data-saver';

    const pages = await fetchChapterPages(id);
    return c.json(pages);
  };
};

export default chapter;
