export type Manga = {
  // ID
  sourceId: string,
  slug: string,

  // Metadata
  title: string,
  alternativeTitles: Array<string>,
  author: string,
  artist: string,
  synopsis: string,


  // Dates type serializes to string
  updatedAt: string,
  createdAt: string,

  // ENUMs
  contentStatus: ContentStatus,
  contentRating: ContentRating,

  // URLs
  url: string,
  coverUrl: string
}

// export enum ReadStatus {
//   PlanningToRead = 'Planning To Read',
//   Reading = 'Reading',
//   OnHold = 'On-Hold',
//   Dropped = 'Dropped',
//   Completed = 'Completed'
// }

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
  mangaId: string,
  slug: string,
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

export type CollectionManga = Pick<Manga, 'sourceId' | 'slug' | 'title' | 'coverUrl'>;

export type DisplayManga = Manga & {
	chapters: Array<Chapter>;
	tags: Array<string>;
};