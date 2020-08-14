import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

// CSS and Assets
import './App.scss';
import Tickets from './assets/movie-tickets.svg';
import Search from './assets/search-icon.svg';

// Statics any Interfaces/Types
import TheMovieDb from './themoviedb';
import { IMovie, IMovieApi } from './types';

// Components
import Home from './container/home';
import Favorites from './container/favorites';
import MovieCard from './components/movieCard';

// Redux
import { rootReducer } from './reducers';

const store = createStore(rootReducer);

export default function App() {
  let typingTimer: NodeJS.Timeout;
  const [search, setSearch] = useState<string>('');
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [foundMovies, setFoundMovies] = useState<IMovie[]>([]);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <header className="container">
            <img
              src={Tickets} alt="Tickets"
              style={{ filter: 'invert(100%)', height: '7.5rem' }} />

            <div className="navbar">
              <div className="nav">
                <NavLink to="/home" activeClassName="active">Home</NavLink>
                <NavLink to="/favorites" activeClassName="active">Favorites</NavLink>
              </div>

              <div className="search">
                <input
                  type="text" placeholder="search for movies"
                  value={search} onChange={(event) => setSearch(event.target.value)}
                  onKeyUp={keyUpHandler} onKeyDown={() => clearTimeout(typingTimer)}
                  onFocus={() => setSearchActive(true)}
                  onBlur={() => { setSearch(''); setSearchActive(false); }} />

                <img
                  src={Search} alt="Search"
                  style={{ filter: 'invert(100%)', height: '1rem' }} />

                {searchActive &&
                <div className="search-results">
                  {foundMovies.length === 0 && <span>No Results Found</span>}

                  {foundMovies.map((movie) => (
                    <div key={movie.id} className="result">
                      <MovieCard
                        bgImage={movie.poster_path}
                        title={movie.title}
                        date={movie.release_date}
                        poster minimal />
                    </div>
                  ))}
                </div> }
              </div>
            </div>
          </header>

          <Switch>
            <Route path="/home">
              <Home />
            </Route>

            <Route path="/favorites">
              <Favorites />
            </Route>

            <Route path="/*">
              <Redirect to="/home" />
            </Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  );

  /**
   * @description
   * Handles creating clearing and setting a new
   * timeout for search input
   */
  function keyUpHandler() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => searchHandler(), 500);
  }
  /**
   * @description
   * Handles the search API and updating
   * `foundMovies` accordingly
   */
  async function searchHandler() {
    if (search.length < 3) return;

    try
    {
      const fetchRes = await fetch(`${TheMovieDb.API_URL}/search/movie?api_key=${TheMovieDb.API_KEY}&query=${search}`);
      if (!fetchRes.ok) throw new Error('Not 2xx response');

      const fetchedMovies: IMovieApi = await fetchRes.json();
      setFoundMovies(fetchedMovies.results.slice(0, 10));
    }
    catch (err)
    {
      console.error('/search/movie API', err);
    }
  }
}
