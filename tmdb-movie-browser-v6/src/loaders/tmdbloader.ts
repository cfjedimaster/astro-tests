import type { LiveLoader } from 'astro/loaders';

interface Genre {
  id: string;
  name: string;
}

interface EntryFilter {
  id: string;
}

export function genreLoader(config: { apiKey: string }): LiveLoader<Genre, EntryFilter, never> {
  return {
    name: 'genre-loader',
    loadCollection: async () => {
      try {

        let genreReq = await fetch('https://api.themoviedb.org/3/genre/movie/list', {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`, 
            'accept':'application/json'
          }
        });

        let genreData = await genreReq.json();
        console.log(`Got ${genreData.genres.length} genres`);
        return {
          entries: genreData.genres.map((g:Genre) => ({
            id: g.id,
            data: g,
          })),
        };
      } catch (error) {
        console.log('------------- ERROR --------');
        return {
          error: new Error('Failed to load genres ', { cause: error }),
        };
      }
    },
    loadEntry: async ({ filter }) => {
      console.log('loadEntry called with filter', filter);
      
      try {
        let movieReq = await fetch(`https://api.themoviedb.org/3/discover/movie?region=US&language=en-US&with_genres=${filter.id}&sort_by=primary_release_date.desc`, {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`, 
            'accept':'application/json'
          }
        });

        let movieData = await movieReq.json();
        console.log(`Loaded movies for ${filter.id}`);
        return {
          id: filter.id,
          data: movieData.results
        }

      } catch (error) {
        return {
          error: new Error('Failed to load movies', { cause: error }),
        };
      }

    },
  };
}