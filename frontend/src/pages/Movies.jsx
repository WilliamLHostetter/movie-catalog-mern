import MovieCard from "../components/MovieCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllMovies, getAllMovieGenres } from "../services/api";
import styles from '../css/Movies.module.css';
import { toast } from "react-toastify";
import { sortReleaseDates, sortWatchedDates } from '../utilities/utils.js'



function Movies() {
  const [selectedGenre, setGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genreFilteredMovies, setGenreFilteredMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Movies';
  }, []); // Empty dependency array ensures the effect runs only once on mount
  
  
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const allMovies = await getAllMovies();
        if(allMovies !== undefined && Array.isArray(allMovies)) {
          setMovies(allMovies);
          setFilteredMovies(allMovies);
          setGenreFilteredMovies(allMovies)
        }
      } catch (error) {
        console.log("Movies.jsx loadMovies error:" + error.message);
        setError("Failed to load movies.");
        toast.error("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);
  
  
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const allGenres = await getAllMovieGenres();
        setGenres(allGenres);
      } catch (error) {
        console.log("Movies.jsx loadGenres error:" + error.message);
        setError("Failed to load movie genres.");
        toast.error("Failed to load movie genres.");
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);


  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return
    if (loading) return

    setLoading(true)
    try {
        const searchResults = movies.filter((movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredMovies(searchResults)
        setSearchQuery(e.target.value)
        setError(null)
    } catch (error) {
        console.log("Movies.jsx handleSearch error:" + error.message);
        setError("Failed to search movies.")
        toast.error("Failed to search movies.");
    } finally {
        setLoading(false)
    }
  };
  

  const handleGenre = async (inputGenre) => {
    if (inputGenre === "" || inputGenre === "Genres") {
      setFilteredMovies(movies)
      setGenreFilteredMovies(movies)
      setGenre("Genres")
      return
    }
    setLoading(true)
    try {
        const movieGenreResults = movies.filter((movie) =>
          movie.genre.toLowerCase().includes(inputGenre.toLowerCase()));
        setFilteredMovies(movieGenreResults)
        setGenreFilteredMovies(movieGenreResults)
        setGenre(inputGenre)
        setError(null)
    } catch (error) {
        console.log("Movies.jsx handleGenre error:" + error.message);
        setError("Failed to select genre.")
        toast.error("Failed to select genre.");
    } finally {
        setLoading(false)
    }
  };

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
    switch (sortOption) {
      case "title":
        const sortedTitleMovies = filteredMovies.toSorted((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
        setFilteredMovies(sortedTitleMovies)
        break;
      case "release_date":
        const sortedReleasedDateMovies = sortReleaseDates(filteredMovies);
        setFilteredMovies(sortedReleasedDateMovies)
        break;
      case "watched_date":
        const sortedWatchedDateMovies = sortWatchedDates(filteredMovies);
        setFilteredMovies(sortedWatchedDateMovies)
        break;
      default:
        setFilteredMovies(genreFilteredMovies)
        break;
    }
  };  
  

  return (
    <div className={styles.page}>
      <h2 className={styles['page-title']}>Movies</h2>
      <form onSubmit={handleSearch} className={styles['search-form']}>
        <input
          type="text"
          placeholder="Search for movies..."
          className={styles['search-input']}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className={styles['search-button']}>
          Search
        </button>
      </form>

        {error && <div className={styles['error-message']}>{error}</div>}
        <section className={styles['sorts-container']}>
          <select
            value={selectedGenre}
            onChange={(e) => handleGenre(e.target.value)}
          >
            <option value="">Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <select 
            value={selectedSort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="title">Title</option>
            <option value="release_date">Release Date</option>
            <option value="watched_date">Watched Date</option>
          </select>
        </section>
        <section className={styles['create-container']}>
        <Link to="/add-movie" target="_blank" rel="noopener noreferrer">
          <button>Add Movie</button>
        </Link>
        </section>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles['movies-grid']}>
        {(Array.isArray(filteredMovies) && filteredMovies.length > 0) ? filteredMovies.map((movie) => (
            <MovieCard movie={movie} key={movie._id} />
          )) : <p className={styles['center-text']}>No movies found</p> }
        </div>
      )}
    </div>
  );
}

export default Movies;
