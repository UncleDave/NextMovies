import Head from 'next/head';
import movieStyles from '../styles/Movie.module.css';
import movieListStyles from '../styles/MovieList.module.css';

function Movie() {
  return (
    <div className={ movieStyles.container }>
      <div className={ movieStyles.poster }>
        <img src="https://m.media-amazon.com/images/M/MV5BMTk5MTI3NjI5OV5BMl5BanBnXkFtZTcwMDc5MTk1OA@@._V1_SX300.jpg" alt="Movie Poster"/>
      </div>
      <div className={ movieStyles.content }>
        <h3 className={ movieStyles.title }>Title</h3>

        <p className={ movieStyles.description }>Description</p>
      </div>
    </div>
  );
}

function MovieList() {
  return (
    <ul className={ movieListStyles.container }>
      <li className={ movieListStyles.item }>
        <Movie/>
      </li>
      <li className={ movieListStyles.item }>
        <Movie/>
      </li>
      <li className={ movieListStyles.item }>
        <Movie/>
      </li>
      <li className={ movieListStyles.item }>
        <Movie/>
      </li>
    </ul>
  );
}

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Next Movies</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main>
        <h1 style={ { textAlign: 'center' } }>Next Movies</h1>

        <MovieList/>
      </main>
    </>
  );
}
