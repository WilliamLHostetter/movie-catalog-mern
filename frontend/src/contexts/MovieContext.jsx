import {createContext, useState, useContext, useEffect} from "react"
import { toast } from "react-toastify";
import { getAllFavoriteMovies, addFavoriteMovie, removeFavoriteMovie } from "../services/api"


const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({children}) => {
    const [movieFavorites, setFavorites] = useState([])

    // useEffect(async () => {
    //     const storedFavs = localStorage.getItem("movieFavorites")
    //     if (storedFavs) setFavorites(JSON.parse(storedFavs))
    // }, [])

    // useEffect(() => {
    //     localStorage.setItem('movieFavorites', JSON.stringify(movieFavorites))
    // }, [movieFavorites])
    
    useEffect(() => {
      const loadFavorites = async () => {
        try{ 
          const storedFavs = await getAllFavoriteMovies()
          if (storedFavs) setFavorites(storedFavs)
        }catch (error) {
          console.log("Failed to load movie favorites. error: " + error);
          toast.error("Failed to load movie favorites.");
        }
      }
        loadFavorites();
    }, []);


    const addToFavorites = async (movie) => {
      setFavorites(prev => [...prev, movie])
      // eslint-disable-next-line no-unused-vars
      const response = await addFavoriteMovie(movie._id)
      if(response.status !== 200) {
        console.log("Error adding movie to favorites on server.");
        toast.error("Error adding movie to favorites on server");
      } 
    }

    const removeFromFavorites = async (movieID) => {
      setFavorites(prev => prev.filter(movie => movie._id !== movieID))
      // eslint-disable-next-line no-unused-vars
      const response = await removeFavoriteMovie(movieID)
      if(response.status !== 200) {
        console.log("Error removing movie from favorites on server.");
        toast.error("Error removing movie from favorites on server.");
      } 
    }
    
    const isFavorite = (movieID) => {
        return movieFavorites.some(movie => movie._id === movieID)
    }

    const value = {
        movieFavorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}