const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

let movies = [];

// Load movies_metadata.json at startup
const filePath = path.join(__dirname, "movies_metadata.json");

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error(" Failed to load movies_metadata.json:", err);
  } else {
    try {
      movies = JSON.parse(data);
      console.log(` Loaded ${movies.length} movies`);
    } catch (parseErr) {
      console.error(" Failed to parse movies_metadata.json:", parseErr);
    }
  }
});

//  Ping test
app.get("/api/ping", (req, res) => {
  console.log("❇️ GET /api/ping");
  res.send("pong!");
});

//  List movies (basic fields only)
app.get("/api/movies", (req, res) => {
  console.log("❇️ GET /api/movies");
  const movieList = movies.map(({ id, title, tagline, vote_average }) => ({
    id,
    title,
    tagline,
    vote_average: Number(vote_average) || 0,
  }));
  res.json({ data: movieList.slice(0, 100) }); // Optional limit
});

//  Get single movie by ID
app.get("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((m) => m.id === id);
  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }
  res.json(movie);
});

// Environment setup
let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
  console.log(" In development mode - using port 3001");
}

// Start server
const listener = app.listen(port, () => {
  console.log(" Express server is running on port", listener.address().port);
});
