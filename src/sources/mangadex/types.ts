export type LanguageCode = { [key: string]: string };

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

		createdAt: string; // Need to convert to date
		updatedAt: string; // Need to convert to date
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
		translatedLanguage: string; // Should assume by default that its 'en'
		externalUrl: string | null;

		publishAt: string;
		readableAt: string;
		createdAt: string;
		updatedAt: string;

		pages: number;
	};
	relationships: Array<{ id: string; type: string }>;
};
