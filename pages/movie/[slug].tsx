import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Header from '../../components/header';
import MovieDetailModel from '../../models/movie-detail';
import styles from '../../styles/MovieDetail.module.css';
import { getMovie } from '../api/movies/[slug]';

interface MovieDetailProps {
  movie: MovieDetailModel;
}

export const getServerSideProps: GetServerSideProps<MovieDetailProps> = async (context) => {
  // Should be present, /movie/ doesn't match this route unless a [slug] param is present.
  // Ideally we'd check anyway and remove the filthy filthy !, but for the sake of time...
  // The movie could also not be found, in which case we'd like to show a 404 page.
  const movie = await getMovie(context.params!.slug as string) as MovieDetailModel;

  return {
    props: {
      movie
    }
  };
};

export default function MovieDetail({ movie }: MovieDetailProps) {
  return (
    <>
      <Head>
        <title>{ movie.title } | Next Movies</title>
      </Head>

      <main>
        <Header value={ movie.title }/>

        <p className={ styles.plot }>
          { movie.plot }
        </p>
      </main>
    </>
  );
}

// TODO: The rest of this page :D
// TODO: Newsletter modal.

// Newsletter modal could be toggled by placing a bool in the component's state to indicate whether or not the modal is visible.
// Fire off a setTimeout in a dependency-less useEffect which flips the bool after 10 seconds and show the modal.
