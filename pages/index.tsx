import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/header';
import MovieModel from '../models/movie';
import movieStyles from '../styles/Movie.module.css';
import movieListStyles from '../styles/MovieList.module.css';
import { getMovies } from './api/movies';

interface MovieProps {
  movie: MovieModel;
}

function Movie({ movie }: MovieProps) {
  const url = `/movie/${ encodeURIComponent(movie.slug) }`;

  return (
    <div className={ movieStyles.container }>
      <div className={ movieStyles.poster }>
        <Link href={ url }>
          <a>
            {
              movie.poster !== 'N/A'
                ? <img src={ movie.poster } alt={ `${ movie.title } poster` }/>
                : (
                  <div className={ movieStyles.noPoster }>
                    <div>No Poster Available</div>
                  </div>
                )
            }
          </a>
        </Link>
      </div>
      <div className={ movieStyles.content }>
        <Link href={ url }><a><h3 className={ movieStyles.title }>{ movie.title }</h3></a></Link>

        <dl>
          <dt>Type</dt>
          <dd>{ movie.type }</dd>

          <dt>Year</dt>
          <dd>{ movie.year }</dd>
        </dl>
      </div>
    </div>
  );
}

interface MovieListProps {
  movies: MovieModel[];
}

function MovieList({ movies }: MovieListProps) {
  return (
    <ul className={ movieListStyles.container }>
      {
        movies.map(x => (
          <li key={ x.imdbId } className={ movieListStyles.item }>
            <Movie movie={ x }/>
          </li>
        ))
      }
    </ul>
  );
}

interface DashboardProps {
  movies: MovieModel[];
}

export const getServerSideProps: GetServerSideProps<DashboardProps> = async () => {
  return {
    props: {
      movies: await getMovies(1)
    }
  };
};

export default function Dashboard({ movies }: DashboardProps) {
  return (
    <>
      <Head>
        <title>Next Movies</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main>
        <Header value="Next Movies"/>

        <MovieList movies={ movies }/>
      </main>
    </>
  );
}

// TODO: Pagination.
// TODO: Filter movies/series only.
