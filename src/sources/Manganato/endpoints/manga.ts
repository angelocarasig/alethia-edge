import { Context } from 'hono';
import axios from 'axios';

import { BASE_MANGA_URL, SOURCE_ID, USER_AGENT } from '../constants';
import { CheerioAPI, load } from 'cheerio';

import { fetchChapters } from './chapters';

import { type Manga, type Chapter, ContentStatus, ContentRating } from '@alethia/types';

const manga = () => {
	return async (c: Context) => {
		const { id } = c.req.param();

		const endpoint = `${BASE_MANGA_URL}/${id}`;

		const { data: html } = await axios.get(endpoint, { headers: { 'User-Agent': USER_AGENT } });

		const $ = load(html);

		const chapters = await fetchChapters(id);

		const createdAt =
			chapters.length > 0
				? chapters
						.reduce((earliest, chapter: Chapter) => {
							const chapterDate = new Date(chapter.date);
							return chapterDate < earliest ? chapterDate : earliest;
						}, new Date())
						.toISOString()
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
		const updatedAt = getUpdatedAt($);

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

const getUpdatedAt = ($: CheerioAPI): string => {
	const updatedLabel = $('span.stre-label')
		.filter((_, el) => $(el).text().includes('Updated'))
		.first();

	// If the 'Updated' label is not found, return null
	if (!updatedLabel.length) {
		return new Date(-1).toISOString();
	}

	const dateText = updatedLabel.next('span.stre-value').text().trim();

	const [datePart, timePart] = dateText.split(' - ');
	if (!datePart || !timePart) {
		return new Date(-1).toISOString();
	}

	const parsedDate = new Date(datePart);

	let [time, period] = timePart.split(' ');

	let [hours, minutes] = time.split(':').map(Number);

	if (period.toUpperCase() === 'AM') {
		if (hours === 12) hours = 0; // Midnight
	} else if (period.toUpperCase() === 'PM') {
		if (hours !== 12) hours += 12; // Afternoon and evening
	}

	const finalDate = new Date(
		parsedDate.getFullYear(),
		parsedDate.getMonth(),
		parsedDate.getDate(),
		hours,
		minutes
	);

	return finalDate.toISOString();
};

export default manga;
