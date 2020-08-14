/* eslint-disable object-curly-newline */
import { IMovie, IActiveList } from '../../types';
import {
  MovieState,
  MovieActionTypes,
  movie_SET_CONFIG,
  movie_UPDATE_FAVORITES,
  movie_ADD,
} from './types';

const initialState: MovieState = {
  isConfig: false,
  favorites: (localStorage.getItem('favorites')) ? (JSON.parse(localStorage.getItem('favorites') as string) as IMovie[]) : [],
  moviesApi:
  {
    top_rated: [],
    upcoming: [],
    now_playing: [],
  },
};

export default function movieReducer(state = initialState, action: MovieActionTypes): MovieState {
  switch (action.type) {
    case movie_SET_CONFIG:
      return {
        ...state,
        isConfig: action.payload.state,
      };

    case movie_UPDATE_FAVORITES:
      return updateFavorites(state, action.payload);

    case movie_ADD:
      return addMovies(state, action.payload);

    default:
      return state;
  }
}

/**
 * @description
 * Handles adding/removing movie from localStorage and returning
 * new state with new `favorites`
 */
function updateFavorites(state: MovieState, payload: {movie: IMovie}): MovieState {
  const { movie } = payload;
  const { favorites } = state;

  const fMovie = favorites.filter((favMovie) => favMovie.id !== movie.id);
  const updatedFavorited: IMovie[] = (fMovie.length === favorites.length)
    ? [...favorites, movie]
    : fMovie;

  localStorage.setItem('favorites', JSON.stringify(updatedFavorited));
  return {
    ...state,
    favorites: updatedFavorited,
  };
}
/**
 * @description
 * Handles pushing `moviesApi` appropriate key
 * with `movies`
 * @param state
 * @param payload
 */
function addMovies(state: MovieState, payload: {key: IActiveList, movies: IMovie[]}): MovieState {
  const updatedMoviesApi = state.moviesApi;
  updatedMoviesApi[payload.key].push(...payload.movies);

  return {
    ...state,
    moviesApi: updatedMoviesApi,
  };
}
