import type { Manga, Chapter, CollectionManga } from '@alethia/types';
import { ContentRating, ContentStatus } from '@alethia/types';

import {
	LanguageCode,
	MangadexChapterResponse,
	MangadexContentRating,
	MangadexMangaResponse,
	MangadexStatus,
	SOURCE_ID
} from '../constants';

const getPreferredLanguageValue = (input: LanguageCode, preferred: string = 'en'): string => {
	if (input[preferred]) {
		return input[preferred];
	} else {
		return Object.values(input)[0];
	}
};

const getAllValues = (input: any): Array<string> => {
	if (Array.isArray(input)) {
		return input.flatMap((obj) => Object.values(obj));
	} else {
		return Object.values(input);
	}
};

const parseMangaDexStatus = (status: MangadexStatus): ContentStatus => {
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
			throw new Error(`Unknown Mangadex Status: ${status}`);
	}
};

const parseMangaDexRating = (rating: MangadexContentRating): ContentRating => {
	switch (rating) {
		case MangadexContentRating.SAFE:
			return ContentRating.Safe;
		case MangadexContentRating.SUGGESTIVE:
			return ContentRating.Suggestive;
		case MangadexContentRating.EROTICA:
			return ContentRating.Explicit;
		case MangadexContentRating.PORNOGRAPHIC:
			return ContentRating.Explicit;
		default:
			throw new Error(`Unknown Mangadex Rating: ${rating}`);
	}
};

export const parseMangaDexManga = (raw: MangadexMangaResponse): Manga => {
	return {
		sourceId: SOURCE_ID,
		slug: raw.id,

		title: getPreferredLanguageValue(raw.attributes.title),
		alternativeTitles: getAllValues(raw.attributes.altTitles),
		author: raw.relationships.find((x) => x.type === 'author')?.attributes?.name || '',
		artist: raw.relationships.find((x) => x.type === 'artist')?.attributes?.name || '',
		synopsis: getPreferredLanguageValue(raw.attributes.description),

		updatedAt: new Date(raw.attributes.updatedAt).toISOString(),
		createdAt: new Date(raw.attributes.createdAt).toISOString(),

		contentStatus: parseMangaDexStatus(raw.attributes.status),
		contentRating: parseMangaDexRating(raw.attributes.contentRating),

		url: `https://mangadex.org/manga/${raw.id}`,
		coverUrl: `https://mangadex.org/covers/${raw.id}/${
			raw.relationships.find((x) => x.type === 'cover_art')?.attributes.fileName
		}`
	};
};

export const parseMangaDexChapter = (mangaId: string, raw: MangadexChapterResponse): Chapter => {
	const chapterNumber = parseInt(raw.attributes.chapter, 10);

	let scanlationGroupName = 'Mangadex';

	const scanlationGroup = raw.relationships.find((rel) => rel.type === 'scanlation_group');
	if (scanlationGroup && scanlationGroup.attributes) {
		scanlationGroupName = scanlationGroup.attributes.name;
	}

	return {
		mangaId: mangaId,
		slug: raw.id,
		chapterNumber: isNaN(chapterNumber) ? 0 : chapterNumber,
		chapterTitle: raw.attributes.title ?? '',
		author: scanlationGroupName,
		date: new Date(raw.attributes.publishAt).toISOString()
	};
};

export const MangaToCollectionManga = (manga: Manga): CollectionManga => ({
	sourceId: manga.sourceId,
	slug: manga.slug,
	title: manga.title,
	coverUrl: manga.coverUrl
});

const getTagNames = (tags: any): Array<string> => {
	return tags.flatMap((tag: { id: string; attributes: { name: any } }) => {
		return getAllValues(tag.attributes.name);
	});
};

export const parseMangaDexTags = (response: MangadexMangaResponse): Array<string> => {
	return getTagNames(response.attributes.tags);
};
