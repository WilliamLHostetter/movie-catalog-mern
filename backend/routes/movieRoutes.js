import express from "express";
import console from "console";
import Movie from "../models/Movie.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { filterUpcomingShows } from '../utilities/utils.js'



const __dirname = path.resolve();
// console.log("movieRoute.js __dirname = " + __dirname)

const router = express.Router();


router.get("/all", async (req, res) => {
  try {
    const allMovies = await Movie.find({});
    res.status(200).json(allMovies);
  } catch (error) {
    console.log("movieRoutes.js /all error: " + error.message)
    res.status(500).json({ error: error.message });
  }
});


router.get("/upcoming", async (req, res) => {
  try {
    let upcomingMovies = []
    const allMovies = await Movie.find({});
    upcomingMovies = filterUpcomingShows(allMovies);
    res.status(200).json(upcomingMovies);
  } catch (error) {
    console.log("movieRoutes.js error: " + error.message)
    res.status(500).json({ error: error.message });
  }
});


  // router.get("/all-genres", (req, res) => {
  //   res.json(allGenres)
  // })


router.get("/all-genres", async (req, res) => {
  try {
    const allMovieGenresQueryResults = await Movie.find().distinct('genre');
    let allMovieGenres = []
    for (let genre of allMovieGenresQueryResults) {
      allMovieGenres = allMovieGenres.concat(genre.split(", "));
    }
    allMovieGenres = [...new Set(allMovieGenres)]; // distinct strings
    allMovieGenres.sort()
    res.status(200).json(allMovieGenres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const movie_image_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public", "movies", "images"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const movie_image_upload = multer({ storage: movie_image_storage });

router.post("/add", movie_image_upload.single('file'), async (req, res) => {
  try {    
    const { body, file } = req;
    // console.log("{ body, file } = " + { body, file });
    // console.log("body.title = " + body.title);
    // console.log("body.description = " + body.description);
    // console.log("body.cast = " + body.cast);
    // console.log("body.watched_date = " + body.watched_date);
    // console.log("body.release_date = " + body.release_date);
    // console.log("body.genre = " + body.genre);
    // console.log("file.originalname = " + file.originalname);
    
    // const movieAdded = await Movie.create({ 
    //   title: body.title,
    //   description: body.description, 
    //   cast: body.cast,
    //   watched_date: body.watched_date,
    //   release_date: body.release_date,
    //   genre: body.genre,
    //   length: body.length,
    //   image: file.originalname,
    // });
    const movieAdded = await Movie.create({ ...body, image: file.originalname, });
    res.sendStatus(200)
  } catch (error) {
    console.log("add movie server error = " + error)
    res.sendStatus(500)
  }
});


router.get("/:id", async (req, res) => {
  const movieID = req.params.id;
  try {
    console.log(`/movie/${movieID}`)
    const movieData = await Movie.findById(movieID)
    res.status(200).json(movieData)
  } catch (error) {
    console.log(`get movie id = ${movieID} error: ${error}`)
    res.sendStatus(500)
  }
});


router.put("/update/:id", movie_image_upload.single('file'), async (req, res) => {
  const movieID = req.params.id;
  try {
    console.log(`/movies/update/${movieID}`)
    if(!mongoose.Types.ObjectId.isValid(movieID)) {
      return res.status(404).json({error: `update movie error: No movie exists with id=${movieID}`})
    }
    const { body, file } = req;
    console.log({ body, file });
    if(file){
      console.log("Uploaded image file")
      const movieData = await Movie.findById(movieID)
      if(movieData && (file.originalname !== movieData.image)){
        // remove original image file if uploaded file has a different name
        const image_filepath = path.join(__dirname, "public", "movies", "images", movieData.image)
        fs.unlink(image_filepath, (error) => {
          if (error) {
            console.error(`Error removing the movie "${movieData.title}" image file ${image_filepath} error: ${error}`);
            return;
          }
          console.log(`Movie image file ${image_filepath} has been successfully removed.`);
        });
      }
      const movieUpdated = await Movie.findOneAndUpdate({_id: movieID}, {...body, image: file.originalname, }, { new: true });
      if(!movieUpdated) {
        return res.status(404).json({error: `update movie error: No movie found with id=${movieID}`});
      }
      res.sendStatus(200)
    }else{
      const movieUpdated = await Movie.findOneAndUpdate({_id: movieID}, {...body, }, { new: true });
      if(!movieUpdated) {
        return res.status(404).json({error: `update movie error: No movie found with id=${movieID}`});
      }
      res.sendStatus(200)
    }
  } catch (error) {
    console.log(`Error updating the movie "${movieData.title}": ${error.message}`)
    res.sendStatus(500)
  }
});


// delete a movie
router.delete("/delete/:id", async (req, res) => {
  const movieID = req.params.id;
  try{
    console.log(`/movies/delete/${movieID}`)
    if (!mongoose.Types.ObjectId.isValid(movieID)) {
      return res.status(400).json({error: `delete movie error: No movie found with id=${movieID}`})
    }
    const movieDeleted = await Movie.findOneAndDelete({_id: movieID})
    if(!movieDeleted) {
      return res.status(400).json({error: `delete movie error: Unable to delete movie with id=${movieID}`})
    } else {
        // remove the image file
        const image_filepath = path.join(__dirname, "public", "movies", "images", movieDeleted.image)
        fs.unlink(image_filepath, (error) => {
          if (error) {
            console.error(`Error removing the movie "${movieDeleted.title}" image file ${image_filepath} error: ${error}`);
            return;
          }
          console.log(`The movie "${movieDeleted.title}" image file ${image_filepath} has been successfully removed.`);
        });
    }
    res.sendStatus(200)
  } catch(error) {
    console.log(`delete movie id = ${movieID} error: ${error.message}`)
    res.sendStatus(500)
  }
});

// get all favorite movies
router.get("/favorites/all", async (req, res) => {
  try {
    const allFavoriteMovies = await Movie.find({favorite: true });
    res.status(200).json(allFavoriteMovies);
  } catch (error) {
    console.log("movieRoutes.js /favorites/all error: " + error.message)
    res.status(500).json({ error: error.message });
  }
});

// add a favorite movie
router.patch("/favorites/add/:id", async (req, res) => {
  const movieID = req.params.id;
  try{
    console.log(`/favorites/add/${movieID}`)
    if (!mongoose.Types.ObjectId.isValid(movieID)) {
      return res.status(400).json({error: `add movie favorite error: No movie found with id=${movieID}`})
    }
    const movieUpdate = await Movie.findOneAndUpdate({_id: movieID}, {favorite: true}, {new: true})
    if(!movieUpdate) {
      return res.status(400).json({error: `add movie favorite error: Unable to add movie favorite with id=${movieID}`})
    } 
    res.sendStatus(200)
  } catch(error) {
    console.log(`add favorite movie id = ${movieID} error: ${error.message}`)
    res.sendStatus(500)
  }
});

// remove a favorite movie
router.patch("/favorites/remove/:id", async (req, res) => {
  const movieID = req.params.id;
  try{
    console.log(`/favorites/remove/${movieID}`)
    if (!mongoose.Types.ObjectId.isValid(movieID)) {
      return res.status(400).json({error: `remove movie favorite error: No movie found with id=${movieID}`})
    }
    const movieUpdate = await Movie.findOneAndUpdate({_id: movieID}, {favorite: false}, {new: true})
    if(!movieUpdate) {
      return res.status(400).json({error: `remove movie favorite error: Unable to remove movie favorite with id=${movieID}`})
    } 
    res.sendStatus(200)
  } catch(error) {
    console.log(`remove favorite movie id = ${movieID} error: ${error.message}`)
    res.sendStatus(500)
  }
});


export default router;