import dotenv from "dotenv"; 
import express from "express";
import path from "path";
import console from "console";
import connectDB from "./config/db.js";
import movieRoutes from "./routes/movieRoutes.js";
import tvShowRoutes from "./routes/tvShowRoutes.js";


const app = express();


// Configuration
dotenv.config() // Load environment variables from .env file
connectDB(); // Connect to MongoDB


// Routes
app.use("/movies", movieRoutes);
app.use("/tv-shows", tvShowRoutes);


// Middleware
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT
const __dirname = path.resolve();
console.log(`__dirname = ${__dirname}`)
app.use("/movies/images", express.static(path.join(__dirname + "/public/movies/images")));
app.use("/tv-shows/images", express.static(path.join(__dirname + "/public/tv-shows/images")));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

