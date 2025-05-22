import mongoose from "mongoose";


const tvShowSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, required: true },
      cast: { type: String },
      genre: { type: String, required: true },
      watched_date: { type: String },
      release_date: { type: String },
      favorite: { type: Boolean, default: false, },
    },
    { timestamps: true }
  );
  
  const TvShow = mongoose.model("tv_shows", tvShowSchema);
  export default TvShow;


