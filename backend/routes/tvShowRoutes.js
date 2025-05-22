import express from "express";
import multer from "multer";
import console from "console";
import path from "path";
import fs from "fs";
import TvShow from "../models/TvShow.js";
import mongoose from "mongoose";
import { filterUpcomingShows } from '../utilities/utils.js'



const __dirname = path.resolve();
// console.log("tvShowRoute.js __dirname = " + __dirname)

const router = express.Router();


router.get("/all-genres", async (req, res) => {
  try {
    const allTvShowGenresQueryResults = await TvShow.find().distinct('genre');
    let allTvShowGenres = []
    for (let genre of allTvShowGenresQueryResults) {
      allTvShowGenres = allTvShowGenres.concat(genre.split(", "));
    }
    allTvShowGenres = [...new Set(allTvShowGenres)]; // distinct strings
    allTvShowGenres.sort()
    res.status(200).json(allTvShowGenres);
  } catch (error) {
    console.log("tvShowrRoute.js all-genres error: " + error.message)
    res.status(500).json({ error: error.message });
  }
})


router.get("/all", async (req, res) => {
  try {
    const allTvShows = await TvShow.find({}).exec();
    res.status(200).json(allTvShows)
  } catch (error) {
    console.log("tvShowRoutes.js /all error: " + error.message)
    res.status(500).json({ error: error.message });
}
})


router.get("/upcoming", async (req, res) => {
  try {
    let upcomingTvShows = [];
    const allTvShows = await TvShow.find({});
    upcomingTvShows = filterUpcomingShows(allTvShows);
    res.status(200).json(upcomingTvShows);
  } catch (error) {
    console.log("tvShowRoutes.js error: " + error.message)
    res.status(500).json({ error: error.message });
  }
});


const tv_show_image_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/public/tv-shows/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const tv_show_image_upload = multer({ storage: tv_show_image_storage });

router.post("/add", tv_show_image_upload.single('file'), async (req, res) => {
  try{
    const { body, file } = req;
    console.log("{ body, file } = " + { body, file });
    // console.log("body.title = " + body.title);
    // console.log("body.description = " + body.description);
    // console.log("body.cast = " + body.cast);
    // console.log("body.watched_date = " + body.watched_date);
    // console.log("body.release_date = " + body.release_date);
    // console.log("body.genre = " + body.genre);
    // console.log("file.originalname = " + file.originalname);
    
    // const tvShowAdded = await TvShow.create({ 
    //   title: body.title,
    //   description: body.description, 
    //   cast: body.cast,
    //   watched_date: body.watched_date,
    //   release_date: body.release_date,
    //   genre: body.genre,
    //   image: file.originalname,
    // });
    const tvShowAdded = await TvShow.create({ ...body, image: file.originalname, });
    res.sendStatus(200)
} catch (error) {
  console.log("add tv show server error = " + error)
  res.sendStatus(500)
}
})


router.get("/:id", async (req, res) => {
  const tvShowID = req.params.id;
  try {
    console.log(`/tv-show/${tvShowID}`)
    const tvShowData = await TvShow.findById(tvShowID);
    res.status(200).json(tvShowData)
  } catch (error) {
    console.log(`get TV show id = ${tvShowID} error:` + error)
    res.sendStatus(500)
  }
});


router.put("/update/:id", tv_show_image_upload.single('file'), async (req, res) => {
  const tvShowID = req.params.id;
  try {
    console.log(`/update-movie/${tvShowID}`)
    if(!mongoose.Types.ObjectId.isValid(tvShowID)) {
      return res.status(404).json({error: `update TV show error: No TV show exists with id=${tvShowID}`})
    }
    const { body, file } = req;
    console.log({ body, file });
    if(file){
      console.log("Uploaded image file")
      const tvShowData = await TvShow.findById(tvShowID)
      if(tvShowData && (file.originalname !== tvShowData.image)){
        // remove original image file if uploaded file has a different name
        const image_filepath = path.join(__dirname, "public", "tv-shows", "images", tvShowData.image)
        fs.unlink(image_filepath, (error) => {
          if (error) {
            console.error(`Error removing TV show image file ${image_filepath} error: ${error}`);
            return;
          }
          console.log(`TV show image file ${image_filepath} has been successfully removed.`);
        });
      }
      const tvShowUpdated = await TvShow.findOneAndUpdate({_id: tvShowID}, {...body, image: file.originalname, }, { new: true });
      if(!tvShowUpdated) {
        return res.status(404).json({error: `update TV show error: No TV show found with id=${tvShowID}`});
      }
      res.sendStatus(200)
    }else{
      const tvShowUpdated = await TvShow.findOneAndUpdate({_id: tvShowID}, {...body, }, { new: true });
      if(!tvShowUpdated) {
        return res.status(404).json({error: `update TV show error: No TV show found with id=${tvShowID}`});
      }
      res.sendStatus(200)
    }
  } catch (error) {
    console.log(`update TV show id = ${tvShowID} error: ${error.message}`)
    res.sendStatus(500)
  }
});



// delete a TV show
router.delete("/delete/:id", async (req, res) => {
  const tvShowID = req.params.id;
  try{
    console.log(`/tv-shows/delete/${tvShowID}`)
    if (!mongoose.Types.ObjectId.isValid(tvShowID)) {
      return res.status(400).json({error: `delete TV show error: No movie found with id=${tvShowID}`})
    }
    const tvShowDeleted = await TvShow.findOneAndDelete({_id: tvShowID})
    if(!tvShowDeleted) {
      return res.status(400).json({error: `delete TV show error: Unable to delete movie with id=${tvShowID}`})
    } else {
        // remove the image file
        const image_filepath = path.join(__dirname, "public", "tv-shows", "images", tvShowDeleted.image)
        fs.unlink(image_filepath, (error) => {
          if (error) {
            console.error(`Error removing the TV show "${tvShowDeleted.title}" image file ${image_filepath} error: ${error}`);
            return;
          }
          console.log(`The TV show "${tvShowDeleted.title}" image file ${image_filepath} has been successfully removed.`);
        });
    }
    res.sendStatus(200)
  } catch(error) {
    console.log(`delete TV show id = ${tvShowID} error: ${error.message}`)
    res.sendStatus(500)
  }
});


// get all favorite TV show
router.get("/favorites/all", async (req, res) => {
  try {
    const allFavoriteTvShows = await TvShow.find({favorite: true });
    res.status(200).json(allFavoriteTvShows);
  } catch (error) {
    console.log("tvShowRoutes.js /favorites/all error: " + error.message)
    res.status(500).json({ error: error.message });
  }
});


// add a favorite TV show
router.patch("/favorites/add/:id", async (req, res) => {
  const tvShowID = req.params.id;
  try{
    console.log(`/favorites/add/${tvShowID}`)
    if (!mongoose.Types.ObjectId.isValid(tvShowID)) {
      return res.status(400).json({error: `add TV show favorite error: No TV show found with id=${tvShowID}`})
    }
    const tvShowUpdate = await TvShow.findOneAndUpdate({_id: tvShowID}, {favorite: true}, {new: true})
    if(!tvShowUpdate) {
      return res.status(400).json({error: `add TV show favorite error: Unable to add TV show favorite with id=${tvShowID}`})
    } 
    res.sendStatus(200)
  } catch(error) {
    console.log(`add TV show favorite id = ${tvShowID} error: ${error.message}`)
    res.sendStatus(500)
  }
});

// remove a favorite TV show
router.patch("/favorites/remove/:id", async (req, res) => {
  const tvShowID = req.params.id;
  try{
    console.log(`/favorites/remove/${tvShowID}`)
    if (!mongoose.Types.ObjectId.isValid(tvShowID)) {
      return res.status(400).json({error: `remove TV show favorite error: No TV show found with id=${tvShowID}`})
    }
    const tvShowUpdate = await TvShow.findOneAndUpdate({_id: tvShowID}, {favorite: false}, {new: true})
    if(!tvShowUpdate) {
      return res.status(400).json({error: `remove TV show favorite error: Unable to remove TV show favorite with id=${tvShowID}`})
    } 
    res.sendStatus(200)
  } catch(error) {
    console.log(`remove favorite TV show id = ${tvShowID} error: ${error.message}`)
    res.sendStatus(500)
  }
});


export default router;






