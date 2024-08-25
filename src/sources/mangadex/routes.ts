import { Hono } from 'hono';

const MangaDex = new Hono();

MangaDex.get('/', (c) =>
	c.json({
		routes: ['recent']
	})
);

import { getRecent } from './endpoints/GET_Recent';

MangaDex.get('/recent', async (c) => {
	const count = parseInt(c.req.query('count') ?? '60');
	const page = parseInt(c.req.query('page') || '0');

	return c.json(await getRecent(count, page));
});

import { getManga } from './endpoints/GET_Manga';

MangaDex.get('/manga', (c) => {
	return c.json(null, 200);
});
MangaDex.get('/manga/:id', async (c) => {
	const { id } = c.req.param();

	return c.json(await getManga(id));
});

import { getChapters } from './endpoints/GET_Chapters';
MangaDex.get('/chapters', (c) => {
	return c.json(null, 200);
});
MangaDex.get('/chapters/:id', async (c) => {
	const { id } = c.req.param();

	return c.json(await getChapters(id));
});

import { getChapterPages } from './endpoints/GET_ChapterContents';

MangaDex.get('/chapter', (c) => {
	return c.json(null, 200);
});
MangaDex.get('/chapter/:id', async (c) => {
	const { id } = c.req.param();
	return c.json(await getChapterPages(id));
});

export default MangaDex;
