export default interface MovieDetailModel {
  title: string;
  year: string;
  imdbId: string;
  type: 'movie' | 'series';
  poster: string;
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
