import { IMovie, IActiveList } from '../../types';

// state
export interface MovieState {
  isConfig: boolean
  favorites: IMovie[]
  moviesApi:
  {
    top_rated: IMovie[]
    upcoming: IMovie[]
    now_playing: IMovie[]
  }
}

/**
 * @description
 * Updates `isConfig` to the return state of movies
 * config API call
 * @param state :boolean
 */
export const movie_SET_CONFIG = 'movie/set:config';
/**
 * @description
 * Adds/Removes `movie` based on whether it
 * exists in `favorites` array or not
 * @param movie :IMovie
 */
export const movie_UPDATE_FAVORITES = 'movie/update:favorites';
/**
 * @description
 * Pushes movies to their coresponding key in `moviesApi`
 * @param key :IActiveList
 * @param movies :IMovie[]
 */
export const movie_ADD = 'movie/add';

// Actions
export interface UpdateFavoritesMovieAction {
  type: typeof movie_UPDATE_FAVORITES
  payload: {movie: IMovie}
}
export interface SetConfigMovieAction {
  type: typeof movie_SET_CONFIG
  payload: {state: boolean}
}
export interface AddMoviesAction {
  type: typeof movie_ADD
  payload: {key: IActiveList, movies: IMovie[]}
}

// movieActions
export type MovieActionTypes = UpdateFavoritesMovieAction | SetConfigMovieAction | AddMoviesAction
