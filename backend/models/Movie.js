import mongoose from "mongoose";


const movieSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, required: true },
      cast: { type: String },
      genre: { type: String, required: true },
      length: { type: String },
      watched_date: { type: String },
      release_date: { type: String },
      favorite: { type: Boolean, default: false, },
    },
    { timestamps: true }
  );
  
  const Movie = mongoose.model("movies", movieSchema);
  export default Movie;


