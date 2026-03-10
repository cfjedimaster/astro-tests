// Define live collections for accessing real-time data
import { defineLiveCollection } from 'astro:content';
import { genreLoader } from './loaders/tmdbloader';

const genres = defineLiveCollection({
  loader: genreLoader({
    apiKey: process.env.TMDB_API_KEY!
  }),
});

export const collections = { genres };