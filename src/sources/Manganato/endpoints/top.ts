import { Context } from 'hono';
import axios from 'axios';

import { BASE_URL, SOURCE_ID, USER_AGENT } from '../constants';
import { load } from 'cheerio';
import { CollectionManga } from '@alethia/types';

const top = () => {
	return async (c: Context) => {
		const { page = '1' } = c.req.query();

		const endpoint = `${BASE_URL}/genre-all/${page}?type=topview`;

		const { data: html } = await axios.get(endpoint, { headers: { 'User-Agent': USER_AGENT } });

		const $ = load(html);

		const mangaList: Array<CollectionManga> = [];
		$('.content-genres-item').each((index, element) => {
			const sourceId = SOURCE_ID;

			const title = $(element).find('.genres-item-name').text().trim();

			const coverUrl = $(element).find('.genres-item-img img').attr('src')!;

			const href = $(element).find('.genres-item-img').attr('href');
			const slug = href ? href.split('/').pop()! : '';

			mangaList.push({ sourceId, slug, title, coverUrl });
		});

		return c.json(mangaList);
	};
};

export default top;
