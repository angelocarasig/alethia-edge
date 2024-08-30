import { Context } from 'hono';
import axios from 'axios';

import { BASE_MANGA_URL, SOURCE_ID, USER_AGENT } from '../constants';
import { load } from 'cheerio';
import { Manga } from '@illithia/types/src/types/manga';
import { Chapter } from '@illithia/types/src/types/chapter';
import { ContentStatus } from '@illithia/types/src/types/content-status';
import { ContentRating } from '@illithia/types/src/types/content-rating';

import { fetchChapters } from './chapters';

const manga = () => {
	return async (c: Context) => {
		const { id } = c.req.param();

		const endpoint = `${BASE_MANGA_URL}/${id}`;

		const { data: html } = await axios.get(endpoint, { headers: { 'User-Agent': USER_AGENT } });

		const $ = load(html);

		const chapters = await fetchChapters(id);

		const createdAt = chapters.length > 0
			? chapters.reduce((earliest, chapter: Chapter) => {
				const chapterDate = new Date(chapter.date);
				return chapterDate < earliest ? chapterDate : earliest;
			}, new Date()).toISOString()
			: new Date().toISOString(); // Default to current date if no chapters

		const tags = $('td:has(.info-genres)')
			.next('td.table-value')
			.find('a.a-h')
			.map((i, el) => $(el).text().trim())
			.get();

		const title = $('.panel-story-info .story-info-right h1').text().trim();
		const authors = $('td:has(.info-author)')
			.next('td.table-value')
			.find('a.a-h')
			.map((i, el) => $(el).text().trim())
			.get()
			.join(', ');
		const description = $('#panel-story-info-description')
			.text()
			.replace('Description :', '')
			.trim();
		const alternativeTitles = $('td:has(.info-alternative)')
			.next('td.table-value')
			.text()
			.split(';')
			.map((title) => title.trim());

		const statusText = $('td:has(.info-status)').next('td.table-value').text().trim();

		const contentStatus = (() => {
			switch (statusText) {
				case 'Ongoing':
					return ContentStatus.Ongoing;
				case 'Completed':
					return ContentStatus.Completed;
				default:
					return ContentStatus.Unknown;
			}
		})();
		const updatedAtText = $('span.stre-value').text().trim();
		const date = updatedAtText ? updatedAtText.split('-')[0].trim() : '';
		const updatedAt = date
			? new Date(date).toISOString().split('T')[0]
			: new Date().toISOString().split('T')[0];

		const coverUrl = $('.story-info-left .info-image img').attr('src') || '';

		const manga: Manga = {
			sourceId: SOURCE_ID,
			slug: id,

			title,
			author: authors,
			artist: authors,
			synopsis: description,
			alternativeTitles,
			coverUrl,
			url: endpoint,

			updatedAt,
			createdAt,

			contentStatus,
			contentRating: ContentRating.Safe
		};

		return c.json({ ...manga, tags, chapters });
	};
};

export default manga;
