import { IMovie } from './iMovie'

export interface IMovieApi
{
  page: number
  results: IMovie[]
  total_pages: number
}