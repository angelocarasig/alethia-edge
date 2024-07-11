import { Tag, ContentStatus, Manga, ReadStatus, ContentRating } from '../../baseTypes';
import { SOURCE_ID } from './constants';
import { MangadexMangaResponse, MangadexStatus } from './types';

const getAllValues = (input: any): Array<string> => {
	if (Array.isArray(input)) {
		return input.flatMap((obj) => Object.values(obj));
	} else {
		return Object.values(input);
	}
};

const getTagNames = (tags: any, mangaId: string): Array<Tag> => {
	return tags.flatMap((tag: { id: string; attributes: { name: any } }) => {
		const tagNames = getAllValues(tag.attributes.name);
		return tagNames.map((name) => ({
			mangaId,
			name
		}));
	});
};

export const mangadexStatusToContentStatus = (status: MangadexStatus): ContentStatus => {
	switch (status) {
		case MangadexStatus.COMPLETED:
			return ContentStatus.Completed;
		case MangadexStatus.ONGOING:
			return ContentStatus.Ongoing;
		case MangadexStatus.CANCELLED:
			return ContentStatus.Cancelled;
		case MangadexStatus.HIATUS:
			return ContentStatus.Hiatus;
		default:
			throw new Error(`Unknown MangadexStatus: ${status}`);
	}
};

export const mangaToCollectionManga = (manga: Manga) => {
	const { id, referenceId, title, coverUrl, inLibrary } = manga;

	return {
		id,
		referenceId,
		title,
		coverUrl,
		inLibrary
	};
};

export const mangadexObjectToMangaObject = (response: MangadexMangaResponse): Manga => {
	const id = response.id;
	const sourceId = SOURCE_ID;
	const referenceId = response.id;

	const inLibrary = false;

	const title = getAllValues(response.attributes.title)[0];
	const alternativeTitles = getAllValues(response.attributes.altTitles).join(', ');

	const author = response.relationships.find((x) => x.type === 'author')?.attributes.name || '';
	const artist = response.relationships.find((x) => x.type === 'artist')?.attributes.name || '';

	const url = `https://mangadex.org/manga/${response.id}`;
	const coverUrl = `https://mangadex.org/covers/${response.id}/${
		response.relationships.find((x) => x.type === 'cover_art')?.attributes.fileName
	}`;

	const description = getAllValues(response.attributes.description)[0];

	const lastRead = new Date().toISOString();
	const dateAdded = new Date(response.attributes.createdAt).toISOString();
	const lastUpdated = new Date(response.attributes.updatedAt).toISOString();

	const readStatus = ReadStatus.PlanningToRead;
	const contentStatus = mangadexStatusToContentStatus(response.attributes.status);
	const contentRating = ContentRating.Safe;

	return {
		id,
		sourceId,
		referenceId,
		inLibrary,
		title,
		alternativeTitles,
		author,
		artist,
		url,
		coverUrl,
		description,
		lastRead,
		dateAdded,
		lastUpdated,
		readStatus,
		contentStatus,
		contentRating
	};
};

export const mangadexObjectToTags = (response: MangadexMangaResponse): Array<Tag> => {
	return getTagNames(response.attributes.tags, response.id);
}