import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';

// Statics any Interfaces/Types
import TheMovieDb from '../themoviedb';

// Components
import MovieCard from '../components/movieCard';

// Redux
import { RootState } from '../reducers';
import { setConfig, updateFavorites } from '../reducers/movieReducer/actions';

const mapState = (state: RootState) => ({
  isConfig: state.movie.isConfig,
  favorites: state.movie.favorites,
});
const mapDispatch = {
  setConfigAction: setConfig,
  updateFavoritesAction: updateFavorites,
};
const connector = connect(mapState, mapDispatch);
type IReduxProps = ConnectedProps<typeof connector>;
type IProps = IReduxProps;

function Favorites(props: IProps) {
  const { isConfig, setConfigAction } = props;
  useEffect(() => {
    if (!isConfig) {
      TheMovieDb.setConfigData()
        .then((state) => {
          setConfigAction({ state });
        });
    }
  }, [isConfig, setConfigAction]);

  const { favorites, updateFavoritesAction } = props;
  return (
    <div className="Favorites container movie-list vr-margin-lg">
      <div className="list-types">
        <span className="active">Favorites</span>
        <hr style={{ flexGrow: 1 }} />
      </div>

      <div className="list-container vr-margin-lg">
        <div className="movie-list">
          {favorites.map((movie) => (
            <div key={movie.id} className="poster-list">
              <MovieCard
                bgImage={movie.poster_path}
                title={movie.title}
                date={movie.release_date}
                poster
                canLike isLiked={favorites.findIndex((favMovie) => favMovie.id === movie.id) !== -1}
                onLike={() => updateFavoritesAction({ movie })} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default connector(Favorites);
