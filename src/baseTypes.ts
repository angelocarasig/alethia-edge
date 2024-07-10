export type Manga = {
  id: string,
  sourceId: string,

  /**
   * Used to query for the manga contents
   */
  referenceId: string,
  inLibrary: boolean,

  title: string,

  /**
   * Comma-separated string
   */
  alternativeTitles: string,
  author: string,
  artist: string,
  description: string,

  // Date type serializes to string
  lastRead: string,
  lastUpdated: string,
  dateAdded: string,

  readStatus: ReadStatus,
  contentStatus: ContentStatus,
  contentRating: ContentRating,

  url: string,
  coverUrl: string
}

export enum ReadStatus {
  PlanningToRead = 'Planning To Read',
  Reading = 'Reading',
  OnHold = 'On-Hold',
  Dropped = 'Dropped',
  Completed = 'Completed'
}

export enum ContentStatus {
  Ongoing = 'Ongoing',
  Hiatus = 'Hiatus',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
  Unknown = 'Unknown',
}

export enum ContentRating {
  Safe = 'Safe',
  Suggestive = 'Suggestive',
  Explicit = 'Explicit'
}

export type Chapter = {
  id: string,
  mangaId: string,

  /**
   * Used to query for the chapter contents
   */
  referenceId: string,
  pages: number,
  chapterNumber: number,
  chapterTitle: string,
  
  /**
   * Refers to scanlation group, source name if the source is a scanlation group, etc.
   */
  author: string,

  // Date type serializes to string
  date: string,
}

export type Tag = {
  mangaId: string,
  name: string,
}

export type CollectionManga = Pick<Manga, 'id' | 'referenceId' | 'title' | 'coverUrl' | 'inLibrary'>;

export type DisplayManga = Manga & {
	chapters: Array<Chapter>;
	groups: Array<any>;
	tags: Array<Tag>;
};