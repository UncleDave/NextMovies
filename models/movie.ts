export default interface MovieModel {
  title: string;
  year: string;
  imdbId: string;
  type: 'movie' | 'series';
  poster: string;
}
