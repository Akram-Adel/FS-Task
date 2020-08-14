/* eslint-disable object-curly-newline */
import { IMovie, IActiveList } from '../../types';
import {
  MovieActionTypes,
  movie_SET_CONFIG,
  movie_UPDATE_FAVORITES,
  movie_ADD,
} from './types';

/**
 * @description
 * Updates `isConfig` to the return state of movies
 * config API call
 */
export function setConfig(payload: {state: boolean}): MovieActionTypes {
  return {
    type: movie_SET_CONFIG,
    payload,
  };
}
/**
 * @description
 * Adds/Removes `movie` based on whether
 * it exists in `favorites` array or not
 */
export function updateFavorites(payload: {movie: IMovie}): MovieActionTypes {
  return {
    type: movie_UPDATE_FAVORITES,
    payload,
  };
}
/**
 * @description
 * Pushes movies to their coresponding key in `moviesApi`
 */
export function addMovies(payload: {key: IActiveList, movies: IMovie[]}): MovieActionTypes {
  return {
    type: movie_ADD,
    payload,
  };
}
