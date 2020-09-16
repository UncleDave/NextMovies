import camelcaseKeys from 'camelcase-keys';
import MovieModel from '../models/movie';

interface OmdbSearchResponseBase {
  response: 'True' | 'False';
}

interface OmdbSearchErrorResponse extends OmdbSearchResponseBase {
  response: 'False';
  error: string;
}

interface OmdbSearchSuccessResponse extends OmdbSearchResponseBase {
  response: 'True';
  search: MovieModel[];
  totalResults: string;
}

type OmdbSearchResponse = OmdbSearchErrorResponse | OmdbSearchSuccessResponse;

export default class OmdbClient {
  private static API_URL = 'https://www.omdbapi.com';

  constructor(private apiKey: string) { }

  async searchMovies(title: string, page: number): Promise<MovieModel[]> {
    const params = new URLSearchParams({
      apikey: this.apiKey,
      s: title,
      page: page.toString()
    });

    const response = await fetch(`${ OmdbClient.API_URL }?${ params }`);
    const data = camelcaseKeys<OmdbSearchResponse>(await response.json(), { deep: true });

    return data.response === 'True' ? data.search : [];
  }
}
