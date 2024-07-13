import axios from 'axios';

import { BASE_URL, USER_AGENT } from '../constants';

export const getChapterPages = async (chapterId: string, quality = 'data-saver') => {
	const ENDPOINT = `${BASE_URL}/at-home/server/${chapterId}`;

	const response = await axios.get(ENDPOINT, { headers: { 'User-Agent': USER_AGENT } });

	const { baseUrl, chapter } = response.data;
	const { hash } = chapter;

	console.log(response.data);

	const filenames = quality === 'data' ? chapter.data : chapter.dataSaver;

	return filenames.map((filename: string) => `${baseUrl}/${quality}/${hash}/${filename}`);
};
