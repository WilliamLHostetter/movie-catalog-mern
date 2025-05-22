import {createContext, useState, useContext, useEffect} from "react"
import { toast } from "react-toastify";
import { getAllFavoriteTvShows, addFavoriteTvShow, removeFavoriteTvShow } from "../services/api"


const TvShowContext = createContext()

export const useTvShowContext = () => useContext(TvShowContext)

export const TvShowProvider = ({children}) => {
    const [tvShowFavorites, setFavorites] = useState([])

    // useEffect(async () => {
    //     const storedFavs = localStorage.getItem("tvShowFavorites")
    //     if (storedFavs) setFavorites(JSON.parse(storedFavs))
    // }, [])

    // useEffect(() => {
    //     localStorage.setItem('tvShowFavorites', JSON.stringify(tvShowFavorites))
    // }, [tvShowFavorites])
    
    useEffect(() => {
      const loadFavorites = async () => {
        try{ 
          const storedFavs = await getAllFavoriteTvShows()
          if (storedFavs) setFavorites(storedFavs)
        }catch (error) {
          console.log("Failed to load TV show favorites. error: " + error);
          toast.error("Failed to load TV show favorites.");
        }
      }
        loadFavorites();
    }, []);


    const addToFavorites = async (tvShow) => {
      setFavorites(prev => [...prev, tvShow])
      // eslint-disable-next-line no-unused-vars
      const response = await addFavoriteTvShow(tvShow._id)
      if(response.status !== 200) {
        console.log("Error adding TV show to favorites on server.");
        toast.error("Error adding TV show to favorites on server");
      } 
    }

    const removeFromFavorites = async (tvShowID) => {
      setFavorites(prev => prev.filter(tvShow => tvShow._id !== tvShowID))
      // eslint-disable-next-line no-unused-vars
      const response = await removeFavoriteTvShow(tvShowID)
      if(response.status !== 200) {
        console.log("Error removing TV show from favorites on server.");
        toast.error("Error removing TV show from favorites on server.");
      } 
    }
    
    const isFavorite = (tvShowID) => {
        return tvShowFavorites.some(tvShow => tvShow._id === tvShowID)
    }

    const value = {
        tvShowFavorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }

    return <TvShowContext.Provider value={value}>
        {children}
    </TvShowContext.Provider>
}