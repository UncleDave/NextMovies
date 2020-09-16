import camelcaseKeys from 'camelcase-keys';
import slugify from 'slugify';
import MovieModel from '../models/movie';
import MovieDetailModel from '../models/movie-detail';

interface OmdbMovie {
  title: string;
  year: string;
  imdbId: string;
  type: 'movie' | 'series';
  poster: string;
}

interface OmdbResponseBase {
  response: 'True' | 'False';
}

interface OmdbErrorResponse extends OmdbResponseBase {
  response: 'False';
  error: string;
}

interface OmdbSearchSuccessResponse extends OmdbResponseBase {
  response: 'True';
  search: OmdbMovie[];
  totalResults: string;
}

type OmdbSearchResponse = OmdbErrorResponse | OmdbSearchSuccessResponse;

interface OmdbGetSuccessResponse extends OmdbResponseBase, OmdbMovie {
  response: 'True';
  rated: string;
  released: string;
  runtime: string;
  genre: string;
  director: string;
  writer: string;
  actors: string;
  plot: string;
  language: string;
  country: string;
  awards: string;
  ratings: {
    source: string,
    value: string
  }[];
  metascore: string;
  imdbRating: string;
  imdbVotes: string;
  totalSeasons?: string;
}

type OmdbGetResponse = OmdbErrorResponse | OmdbGetSuccessResponse;

// The public methods of this class could be memoized to provide a quick and dirty memory cache based on parameters.
// Since the data being queried is fairly stable the cache could last at least a day before expiring.
// For a cache that persists between server restarts something like Redis would be the next logical step.
export class OmdbClient {
  private static API_URL = 'https://www.omdbapi.com';

  constructor(private apiKey: string) { }

  async searchMovies(title: string, page: number): Promise<MovieModel[]> {
    const params = new URLSearchParams({
      apikey: this.apiKey,
      s: title,
      page: page.toString()
    });

    const data = await OmdbClient.makeRequest<OmdbSearchResponse>(params);

    return data.response === 'True' ? data.search.map(OmdbClient.convertToMovieModel) : [];
  }

  async getMovie(title: string): Promise<MovieDetailModel | null> {
    const params = new URLSearchParams({
      apikey: this.apiKey,
      t: title,
      plot: 'full'
    });

    const data = await OmdbClient.makeRequest<OmdbGetResponse>(params);

    return data.response === 'True' ? data : null;
  }

  private static async makeRequest<T>(params: URLSearchParams): Promise<T> {
    const response = await fetch(`${ OmdbClient.API_URL }?${ params }`);

    // Ideally when this data arrives we should cleanse it a bit and transform it for our needs.
    // For now just camelcasing the keys will do.
    return camelcaseKeys<T>(await response.json(), { deep: true });
  }

  private static convertToMovieModel(omdbMovie: OmdbMovie): MovieModel {
    return {
      ...omdbMovie,
      // Add a more url friendly slug. This is somewhat dangerous as the slugification process is destructive and the data source is third party.
      // If too much information is lost the data could become inaccessible, but fortunately this particular API does enough fuzzy matching to not pose a problem.
      slug: slugify(omdbMovie.title, { lower: true })
    };
  }
}

// I want to re-use one instance of OmdbClient so instantiate and export it here, but ideally the instantiation would occur somewhere else
// and this file should just provide the class definition.

const omdbApiKey = process.env.OMDB_API_KEY;

if (!omdbApiKey)
  throw new Error('No OMDB_API_KEY environment variable found');

const omdbClient = new OmdbClient(omdbApiKey);

export default omdbClient;
