import { ContentStatus, Manga, ContentRating } from '../../baseTypes';
import { SOURCE_ID } from './constants';
import { MangadexMangaResponse, MangadexStatus } from './types';

const getAllValues = (input: any): Array<string> => {
	if (Array.isArray(input)) {
		return input.flatMap((obj) => Object.values(obj));
	} else {
		return Object.values(input);
	}
};

const getTagNames = (tags: any, mangaId: string): Array<string> => {
	return tags.flatMap((tag: { id: string; attributes: { name: any } }) => {
		return getAllValues(tag.attributes.name);
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
	const { sourceId, slug, title, coverUrl } = manga;

	return {
		sourceId,
		slug,
		title,
		coverUrl
	};
};

export const mangadexObjectToMangaObject = (response: MangadexMangaResponse): Manga => {
	const sourceId = SOURCE_ID;
	const slug = response.id;

	const title = getAllValues(response.attributes.title)[0];
	const alternativeTitles = getAllValues(response.attributes.altTitles);
	const author = response.relationships.find((x) => x.type === 'author')?.attributes.name || '';
	const artist = response.relationships.find((x) => x.type === 'artist')?.attributes.name || '';
	const synopsis = getAllValues(response.attributes.description)[0];

	const updatedAt = new Date(response.attributes.updatedAt).toISOString();
	const createdAt = new Date(response.attributes.createdAt).toISOString();

	const contentStatus = mangadexStatusToContentStatus(response.attributes.status);
	const contentRating = ContentRating.Safe;

	const url = `https://mangadex.org/manga/${response.id}`;
	const coverUrl = `https://mangadex.org/covers/${response.id}/${
		response.relationships.find((x) => x.type === 'cover_art')?.attributes.fileName
	}`;

	return {
		sourceId,
		slug,

		title,
		alternativeTitles,
		author,
		artist,
		synopsis,
		
		createdAt,
		updatedAt,
		
		contentStatus,
		contentRating,
		
		url,
		coverUrl,
	};
};

export const mangadexObjectToTags = (response: MangadexMangaResponse): Array<string> => {
	return getTagNames(response.attributes.tags, response.id);
}