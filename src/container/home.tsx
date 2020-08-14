import React, { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';

// CSS and Assets
import Loading from '../assets/loading.gif';

// Statics any Interfaces/Types
import TheMovieDb from '../themoviedb';
import { IMovieApi, IMovie, IActiveList } from '../types';

// Components
import MovieCard from '../components/movieCard';

// Redux
import { RootState } from '../reducers';
import { MovieState } from '../reducers/movieReducer/types';
import { updateFavorites, addMovies } from '../reducers/movieReducer/actions';

const mapState = (state: RootState) => ({
  favorites: state.movie.favorites,
  moviesApi: state.movie.moviesApi,
});
const mapDispatch = {
  updateFavoritesAction: updateFavorites,
  addMoviesAction: addMovies,
};
const connector = connect(mapState, mapDispatch);
type IReduxProps = ConnectedProps<typeof connector>;
type IProps = IReduxProps;

function Home(props: IProps) {
  // Animation States
  const [descOpacity, setDescOpacity] = useState<number>(1);

  const [coverMovie, setCoverMovie] = useState<IMovie>();
  const [activeList, setActiveList] = useState<IActiveList>('top_rated');
  const [listState, setListState] = useState<'display' | 'page'>('display');
  const [featMovie, setFeatMovie] = useState<IMovie>();
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [listPage, setListPage] = useState<number>(1);
  const [movieList, setMovieList] = useState<IMovie[]>([]);

  const { moviesApi, addMoviesAction } = props;
  useEffect(() => {
    startupDataHandler(moviesApi, addMoviesAction);
  }, [moviesApi, addMoviesAction]);

  const w300 = TheMovieDb.getSizeClosest(300);
  const { top_rated: topRated } = moviesApi;
  const { favorites, updateFavoritesAction } = props;
  return (
    <div className="Home">
      <section
        className="cover-image"
        style={{ backgroundImage: (coverMovie) ? `url('${TheMovieDb.getImage('original', coverMovie.backdrop_path)}')` : '' }}>

        {(coverMovie) &&
        <div className="container cover-content">

          <div className="description animated" style={{ opacity: descOpacity }}>
            <h1>{coverMovie?.title}</h1>
            <p>{coverMovie?.overview}</p>

            <div className="rating-container">
              <div className="rating-bubble hr-margin">
                <div className="rating">
                  <span>{coverMovie?.vote_average}</span>
                </div>
              </div>

              <div>{coverMovie?.vote_count} Reviews</div>
            </div>
          </div>

          <div className="top-feat">
            {[...Array(5)].map((i, index) => (
              <div key={topRated[index].id}>
                <div
                  className={`cover ${(topRated[index].id === coverMovie.id) ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${TheMovieDb.getImage(w300, topRated[index].poster_path)})` }}
                  role="presentation" onClick={() => coverMovieHander(topRated[index])} />
              </div>
            ))}
          </div>

        </div> }
      </section>

      <section className="container movie-list vr-margin-lg">
        <div className="list-types">
          <span
            className={(activeList === 'top_rated') ? 'active' : undefined}
            role="button" tabIndex={0}
            onKeyPress={({ keyCode, which }) => { if (keyCode === 13 || which === 13) activeListHandler('top_rated'); }}
            onClick={() => activeListHandler('top_rated')}>Top Movies</span>
          <span>/</span>

          <span
            className={(activeList === 'upcoming') ? 'active' : undefined}
            role="button" tabIndex={0}
            onKeyPress={({ keyCode, which }) => { if (keyCode === 13 || which === 13) activeListHandler('upcoming'); }}
            onClick={() => activeListHandler('upcoming')}>Upcoming</span>
          <span>/</span>

          <span
            className={(activeList === 'now_playing') ? 'active' : undefined}
            role="button" tabIndex={0}
            onKeyPress={({ keyCode, which }) => { if (keyCode === 13 || which === 13) activeListHandler('now_playing'); }}
            onClick={() => activeListHandler('now_playing')}>Now Playing</span>
          <hr style={{ flexGrow: 1 }} />
        </div>

        <div className="list-container vr-margin-lg">
          <div className={`feat-movie ${(listState === 'page') ? 'closed' : ''}`}>
            {featMovie &&
            <MovieCard
              bgImage={featMovie.backdrop_path}
              title={(listState === 'display') ? featMovie.title : ''}
              date={(listState === 'display') ? featMovie.release_date : ''}
              canLike={(listState === 'display')} isLiked={favorites.findIndex((favMovie) => favMovie.id === featMovie.id) !== -1}
              onLike={() => updateFavoritesAction({ movie: featMovie })} /> }
          </div>

          <div className="movie-list">
            {movieList.map((movie) => (
              <div key={movie.id} className={(listState === 'display') ? 'display-list' : 'poster-list'}>
                <MovieCard
                  bgImage={(listState === 'display') ? movie.backdrop_path : movie.poster_path}
                  title={movie.title}
                  date={movie.release_date}
                  poster={listState === 'page'}
                  canLike isLiked={favorites.findIndex((favMovie) => favMovie.id === movie.id) !== -1}
                  onLike={() => updateFavoritesAction({ movie })} />
              </div>
            ))}
          </div>
        </div>

        <div
          className="more-button vr-padding"
          role="presentation" onClick={() => loadMoreHandler()}>
          {(listLoading)
            // eslint-disable-next-line react/jsx-max-props-per-line
            ? <img src={Loading} alt="Loading" height={19} />
            : <span>+ Load More</span>}
        </div>
      </section>
    </div>
  );

  /**
   * @description
   * Handles getting home startup data: `moviedb configs`,
   * `top-rated movies` -- Calles movie `setConfigStatus` accordingly
   */
  async function startupDataHandler(pMoviesApi: MovieState['moviesApi'], pAddMovies: any) {
    try
    {
      let movies: IMovie[];
      if (pMoviesApi.top_rated.length === 0)
      {
        const configStatus = await TheMovieDb.setConfigData();
        if (configStatus === false) throw new Error("Not 2xx response, Coudn't get Movie config data");

        const fetchMovie = await fetch(`${TheMovieDb.API_URL}/movie/top_rated?api_key=${TheMovieDb.API_KEY}&page=1`);
        if (!fetchMovie.ok) throw new Error('Not 2xx response');

        const movieApi: IMovieApi = await fetchMovie.json();
        movies = movieApi.results;
        pAddMovies({ key: 'top_rated', movies });
      }
      else
      {
        movies = pMoviesApi.top_rated.slice(0, 20);
      }

      setCoverMovie(movies[0]);
      setFeatMovie(movies[0]);
      setMovieList(movies.slice(1, 7));
    }
    catch (err)
    {
      console.error('/movie/top_rated API', err);
    }
  }
  /**
   * @description
   * Fetches movies from the API base on `type` and `page` -- Returns
   * the data
   */
  async function fetchMovieHandler(type: IActiveList, page: number): Promise<IMovie[]> {
    try
    {
      const fetchMovie = await fetch(`${TheMovieDb.API_URL}/movie/${type}?api_key=${TheMovieDb.API_KEY}&page=${page}`);
      if (!fetchMovie.ok) throw new Error('Not 2xx response');

      const movieApi: IMovieApi = await fetchMovie.json();
      return movieApi.results;
    }
    catch (err)
    {
      console.error(`/movie/${type} API`, err);
      return [];
    }
  }
  /**
   * @description
   * Changes state `coverMovie` and animates
   * `descOpacity`
   */
  function coverMovieHander(newCoverMovie: IMovie) {
    setDescOpacity(0);

    setTimeout(() => {
      setCoverMovie(newCoverMovie);
      setDescOpacity(1);
    }, 500);
  }
  /**
   * @description
   * Handles changing `activeList`, `listPage` and `movieList`
   * to their appropriate value
   */
  async function activeListHandler(listValue: IActiveList) {
    setActiveList(listValue);
    setListPage(1);

    let fetchedMovies: IMovie[] = [];
    if (props.moviesApi[listValue].length === 0)
    {
      setMovieList([]);
      fetchedMovies = await fetchMovieHandler(listValue, 1);
      addMoviesAction({ key: listValue, movies: fetchedMovies });
    }

    const movies = (fetchedMovies.length > 0) ? fetchedMovies : props.moviesApi[listValue];
    if (listState === 'display')
    {
      setFeatMovie(movies[0]);
      setMovieList(movies.slice(1, 7));
    }
    else
    {
      setMovieList(movies.slice(0, 20));
    }
  }
  /**
   * @description
   * Handles changing listState -- Updating movieList
   * with appropriate MovieAPi
   */
  async function loadMoreHandler() {
    if (listState === 'display')
    {
      setListState('page');
      setMovieList(props.moviesApi[activeList].slice(0, 20));
      return;
    }

    let movies: IMovie[];
    if (props.moviesApi[activeList].length === 20 * listPage || props.moviesApi[activeList].length === 0)
    {
      setListLoading(true);
      const fetchedMovies = await fetchMovieHandler(activeList, listPage + 1);
      addMoviesAction({ key: activeList, movies: fetchedMovies });
      movies = props.moviesApi[activeList];
      setListLoading(false);
    }
    else
    {
      movies = props.moviesApi[activeList].slice(0, 20 * (listPage + 1));
    }

    setMovieList(movies);
    if (props.moviesApi[activeList].length !== 20 * listPage) setListPage(listPage + 1);
  }
}
export default connector(Home);
