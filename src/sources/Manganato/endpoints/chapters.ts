import { load } from 'cheerio';
import axios from 'axios';
import { BASE_MANGA_URL, USER_AGENT } from '../constants';
import { Context } from 'hono';
import { Chapter } from '@alethia/types';

export const fetchChapters = async (id: string): Promise<Array<Chapter>> => {
	const endpoint = `${BASE_MANGA_URL}/${id}`;

	const { data: html } = await axios.get(endpoint, { headers: { 'User-Agent': USER_AGENT } });

	const $ = load(html);

	const chapters: Array<Chapter> = [];

	$('ul.row-content-chapter li.a-h').each((index, element) => {
		const chapterElement = $(element);

		const chapterTitle = chapterElement.find('a.chapter-name').text().trim();
		const chapterNumber = parseFloat(chapterTitle.split(' ')[1]); // Use parseFloat to include decimals

		const chapterDateText = chapterElement.find('.chapter-time').attr('title') ?? -1;
		const chapterDate = chapterDateText !== -1 ? new Date(chapterDateText) : new Date(-1);

		const chapter: Chapter = {
			mangaId: id,
			slug: `${id}/chapter-${chapterNumber}`,
			chapterNumber,
			chapterTitle,
			author: 'manganato',
			date: chapterDate.toISOString()
		};

		chapters.push(chapter);
	});

	return chapters;
};

const chapters = () => {
	return async (c: Context) => {
		const { id } = c.req.param();

		try {
			const chapterList = await fetchChapters(id);
			return c.json(chapterList);
		} catch (error) {
			console.error('Error fetching chapters:', error);
			return c.json({ error: 'Failed to fetch chapters' }, 500);
		}
	};
};

export default chapters;
