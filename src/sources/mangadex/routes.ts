import { Hono } from 'hono';

const MangaDex = new Hono();

MangaDex.get('/', (c) => c.text('Source Title: Mangadex'));

/**
 * GET Recent
 * @field count - number of items to request (defaults to 60)
 * @field page - what page of items to retrieve (defaults to 1)
 * --------------------
 * Should return JSON array of @type CollectionManga:
 * id - string ... an identifier (cuid if needed)
 * sourceId - string ... source origin (required, should be of pattern {author}-{source} )
 * title - string ... manga title
 * coverUrl - string ... url to the cover
 * inLibrary - boolean ... that's always false
 * --------------------
 */
import { getRecent } from './endpoints/GET_Recent';

MangaDex.get('/recent', async (c) => {
	const count = parseInt(c.req.query('count') ?? '60');
	const page = parseInt(c.req.query('page') || '0');

	return c.json(await getRecent(count, page));
});

/**
 * GET Manga
 * @param id - Reference ID of manga to retrieve manga details
 * --------------------
 * Should return JSON array of @type DisplayManga:
 * id - string ... an identifier (cuid if needed)
 * sourceId - string ... source origin (required, should be of pattern {author}-{source} )
 * referenceId - string ... reference Id that helps in getting chapter contents
 * inLibrary - boolean ... that's always false
 * 
 * title - string ... manga title
 * alternativeTitles - string ... comma-separated string of alt titles
 * author - string ... author (defaults to '')
 * artist - string ... artist (defaults to '')
 * description - string ... description (defaults to '')
 * 
 * lastRead - string ... serialized Date as string (defaults to -1)
 * lastUpdated - string ... serialized Date as string (defaults to current time)
 * dateAdded - string ... serialized Date as string that's always -1 (or otherewise)
 * 
 * readStatus - enum .. defaults to (PlanningToRead)
 * contentStatus - enum ... defaults to (Unknown)
 * contentRating - enum	...	defaults to (safe)
 * 
 * url - string ... url to manga
 * coverUrl - string ... url to the cover
 * --------------------
 */
import { getManga } from './endpoints/GET_Manga';

MangaDex.get('/manga/:id', async (c) => {
	const { id } = c.req.param();

	return c.json(await getManga(id));
});


/**
 * GET chapters
 * @param id - Reference ID of manga to request chapters for
 * --------------------
 * Should return JSON array of @type Chapter:
 * id - string ... an identifier (cuid if needed)
 * mangaId - string ... id of manga requested
 * referenceId - string ... reference Id that helps in getting chapter contents
 * pages - number ... number of pages
 * chapterNumber - number ... chapter number (defaults to 0 if not provided)
 * chapterTitle - string ... chapter title (defaults to '' if not provided)
 * author - author ... that's always false
 * date - date ... date of chapter release
 * --------------------
 */
import { getChapters } from './endpoints/GET_Chapters';

MangaDex.get('/chapters/:id', async (c) => {
	const { id } = c.req.param();

	return c.json(await getChapters(id));
});

/**
 * GET chapter contents
 * @param ID - Reference ID of chapter we're fetching chapter contents from
 * --------------------
 * Should return JSON array of @type string
 * Images should be sorted in order of appearance
 * Each item in the array is a URL to the image
 * --------------------
 */
import { getChapterPages } from './endpoints/GET_ChapterContents';

MangaDex.get('/chapter/:id', async (c) => {
	const { id } = c.req.param();
	return c.json(await getChapterPages(id));
})

export default MangaDex;
