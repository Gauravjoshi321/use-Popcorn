import { useEffect, useRef, useState } from "react";
import StarRating from "./star";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "2d1e77c8";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useLocalStorageState([], "watched")
  const { movies, isLoading, error } = useMovies(query);


  function handleSelectedId(id) {
    selectedId === id
      ? setSelectedId(null)
      : setSelectedId(id);
  }

  function nullSelectedId() {
    setSelectedId(null);
  }

  function handleAllWatchedMovies(newlyWatched) {
    setWatched(watched => ([...watched, newlyWatched]));

    // localStorage.setItem("watched", JSON.stringify([...watched, newlyWatched]))
  }

  function handleDeleteWatched(id) {
    const arr = watched.filter(movie => movie.imdbID !== id);
    setWatched(arr);
  }


  return (
    <>

      <NavBar>
        <SearchBar query={query} setQuery={setQuery} />
        <p className="num-results">
          Found <strong>{movies.length}</strong> results
        </p>
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && <MovieList movies={movies} onSelectedId={handleSelectedId} />}
        </Box>
        <Box>
          {selectedId
            ? <MovieDetails
              selectedId={selectedId}
              onCloseMovie={nullSelectedId}
              onHandleAllWatchedMovies={handleAllWatchedMovies}
              watched={watched}
            />
            : <>
              <SummaryMovies watched={watched} />
              <MoviesCollection
                watched={watched}
                onDeleteWatched={handleDeleteWatched} />
            </>}
        </Box>
      </Main >
    </>
  );
}

//////////////////////////////////////////////////////

function ErrorMessage({ message }) {
  return <p className="error">
    <span>⛔</span> {message}
  </p>
}

function Loader() {
  return <p className="loader">Loading...</p>
}

function NavBar({ children }) {

  return <nav className="nav-bar">
    <Logo />
    {children}
  </nav>
}

function Logo() {
  return <div className="logo">
    <span role="img">🍿</span>
    <h1>usePopcorn</h1>
  </div>
}

function SearchBar({ query, setQuery }) {

  const myRef = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === myRef.current) return;
    myRef.current.focus();
    setQuery('');
  })


  return <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    ref={myRef}
    onChange={(e) => {
      setQuery(e.target.value)
    }}
  />
}

/////////////////////////////////////////////////////

function Button({ setIsOpen, isOpen }) {
  return <button
    className="btn-toggle"
    onClick={() => setIsOpen((open) => !open)}
  >
    {isOpen ? "–" : "+"}
  </button>
}

function Main({ children }) {
  return <main className="main">
    {children}
  </main>
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return <div className="box">
    <Button setIsOpen={setIsOpen} isOpen={isOpen} />

    {isOpen && children}
  </div>
}


function MovieList({ movies, onSelectedId }) {
  return <ul className="list list-movies">

    {movies?.map((movie) => (
      <Movie movie={movie} onSelectedId={onSelectedId} key={movie.imdbID} />
    ))}
  </ul>
}

function Movie({ movie, onSelectedId }) {
  return <li onClick={() => onSelectedId(movie.imdbID)}>

    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>

    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>

  </li>
}

/////////////////////////////////////////////////////////////////////

function MovieDetails({ selectedId, onCloseMovie, onHandleAllWatchedMovies, watched }) {
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState('');
  const { Title } = movie;

  function handleWatchedMovie() {
    const watchedMovie = {
      Poster: movie.Poster,
      Title: movie.Title,
      imdbRating: movie.imdbRating,
      imdbID: selectedId,
      runtime: Number(movie.Runtime.split(' ').at(0)),
      userRating,
      countUserRated: countRef.current
    }
    onHandleAllWatchedMovies(watchedMovie);
    onCloseMovie();
  }

  const isWatched = watched.map(w => w.imdbID).includes(selectedId);

  const countRef = useRef(0);

  useEffect(function () {
    if (userRating) countRef.current++;
  }, [userRating])

  useKey("Escape", onCloseMovie);

  useEffect(function () {

    async function getMovieDetails() {
      setUserRating('');
      setIsLoading(true);
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);

      if (res.status !== 200) throw new Error("Something went wrong");

      const data = await res.json();
      setIsLoading(false);
      setMovie(data);
    }

    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!Title) return;
    document.title = `Movie | ${Title}`;

    return (() => {
      document.title = "usePopcorn";
    })
  }, [Title])


  return <div className="details">
    {
      isLoading ? <Loader /> :
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
            <img src={movie.Poster} alt={`Poster of ${movie.Title} movie`} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐</span>
                {movie.imdbRating} IMDB rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {
                !isWatched ?
                  <>
                    < StarRating
                      maxRating={10}
                      size={22}
                      setTestRating={setUserRating}
                    />


                    {userRating > 0 && <button
                      className="btn-add"
                      onClick={handleWatchedMovie}
                    >+ Add to list</button>
                    }
                  </> :
                  <p>You have rated this movie</p>
              }
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
    }
  </div>
}

function SummaryMovies({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating.toFixed(2)}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating.toFixed(2)}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime.toFixed()} min</span>
      </p>
    </div>
  </div>
}

function MoviesCollection({ watched, onDeleteWatched }) {
  return <ul className="list">
    {watched.map((movie) => (
      <li key={movie.imdbID}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
          <button
            className="btn-delete"
            onClick={() => onDeleteWatched(movie.imdbID)}
          >
            X
          </button>
        </div>
      </li>
    ))}
  </ul>
}
