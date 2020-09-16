import { NextApiRequest, NextApiResponse } from 'next';
import MovieDetailModel from '../../../models/movie-detail';
import omdbClient from '../../../utils/omdb-client';

export function getMovie(title: string): Promise<MovieDetailModel | null> {
  return omdbClient.getMovie(title);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  const title = req.query.slug;

  if (!title || Array.isArray(title)) {
    res.status(400).end();
    return;
  }

  const movie = await getMovie(title);

  if (!movie) {
    res.status(404).end();
    return;
  }

  res.status(200).json(movie);
}
