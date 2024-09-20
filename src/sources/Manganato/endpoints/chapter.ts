import { Context } from 'hono';
import axios from 'axios';
import { load } from 'cheerio';
import { BASE_MANGA_URL } from '../constants';

const chapter = () => {
	return async (c: Context) => {
		const { id } = c.req.param();

		console.log('ID: ', id);

		const endpoint = `${BASE_MANGA_URL}/${id}`;

		console.log('Endpoint: ', endpoint);

		try {
			const { data: html } = await axios.get(endpoint);

			const $ = load(html);

			const imageUrls: Array<string> = [];

			$('.container-chapter-reader img').each((index, element) => {
				const imageUrl = $(element).attr('src');

				if (imageUrl) {
					imageUrls.push(imageUrl);
				}
			});

			return c.json(imageUrls);
		} catch (error) {
			console.error('Error fetching chapter images:', error);
			return c.json({ error: 'Failed to fetch chapter images' }, 500);
		}
	};
};

export default chapter;
