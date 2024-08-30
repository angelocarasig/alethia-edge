export const SOURCE_ID = '@illithia/mangadex';

export const BASE_URL = 'https://api.mangadex.org';

export const USER_AGENT =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36';

export type LanguageCode = { [key: string]: string };

export type MangadexMangaResponse = {
	id: string;
	type: 'manga';

	attributes: {
		title: LanguageCode;
		altTitles: Array<LanguageCode>;
		description: LanguageCode;
		status: MangadexStatus;
		contentRating: MangadexContentRating;
		tags: [{ id: string; type: 'tag'; attributes: MangadexTagAttributes }];

		// Dates are in format ISO-8601 - https://en.wikipedia.org/wiki/ISO_8601
		createdAt: string;
		updatedAt: string;
	};
	relationships: [
		{
			id: string;
			type: 'author' | 'artist' | 'cover_art';
			attributes: { [key: string]: string };
		}
	];
};

export type MangadexChapterResponse = {
	id: string;
	type: 'chapter';

	attributes: {
		volume: string | null;
		chapter: string;
		title: string;
		translatedLanguage: string;
		externalUrl: string | null;

		// Dates are in format ISO-8601 - https://en.wikipedia.org/wiki/ISO_8601
		publishAt: string;
		readableAt: string;
		createdAt: string;
		updatedAt: string;

		pages: number;
	};
	relationships: [
		{
			id: string;
			type: string;
			attributes: { [key: string]: string };
		}
	];
};

export enum MangadexStatus {
	COMPLETED = 'completed',
	ONGOING = 'ongoing',
	CANCELLED = 'cancelled',
	HIATUS = 'hiatus'
}

export enum MangadexContentRating {
	SAFE = 'safe',
	SUGGESTIVE = 'suggestive',
	EROTICA = 'erotica',
	PORNOGRAPHIC = 'pornographic'
}

export type MangadexTagAttributes = {
	name: { [key: string]: string };
	description: string;
};
