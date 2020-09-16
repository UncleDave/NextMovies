import { NextApiRequest, NextApiResponse } from 'next';
import MovieModel from '../../../models/movie';
import omdbClient from '../../../utils/omdb-client';

// This variety of aggregation results in inconsistent page sizes when one data source runs dry
// but given that more robust techniques require much more work this will do for now.
export async function getMovies(page: number): Promise<MovieModel[]> {
  const results$ = [
    omdbClient.searchMovies('trend', page),
    omdbClient.searchMovies('him', page)
  ];

  const [trendResults, himResults] = await Promise.all(results$);

  return [
    ...trendResults,
    ...himResults
  ];
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // This should be in a function or a middleware.
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  // Not the best way to do it, but good enough to start with.
  // For example, -5 will become 5.
  const page = +req.query.page;

  if (!Number.isInteger(page)) {
    res.status(400).end();
    return;
  }

  res.status(200).json(await getMovies(page));
}
