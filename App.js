import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function MovieList({ movies }) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <a key={movie.id} href={`/movie/${movie.id}`} className="movie-card">
          <h3>{movie.title}</h3>
          <p>{movie.tagline}</p>
          <p>Rating: {movie.vote_average}/10</p>
        </a>
      ))}
    </div>
  );
}

function MovieDetail({ id }) {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      const res = await fetch(`/api/movies/${id}`);
      const payload = await res.json();
      setMovie(payload.data);
    }
    fetchMovie();
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  const releaseDate = new Date(movie.release_date).toLocaleDateString();
  return (
    <div className="movie-detail">
      <h2>{movie.title}</h2>
      <p><strong>Tagline:</strong> {movie.tagline}</p>
      <p><strong>Overview:</strong> {movie.overview}</p>
      <p><strong>Release Date:</strong> {releaseDate}</p>
      <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
      <p><strong>Rating:</strong> {movie.vote_average}/10</p>
      <p><strong>Status:</strong> {movie.status}</p>
      <p><strong>Genres:</strong> {movie.genres}</p>
      <a href="/" className="back-link">← Back to List</a>
    </div>
  );
}

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await fetch('/api/movies');
      const payload = await response.json();
      setMovies(payload.data);
    }
    getData();
  }, []);

  return (
    <Router>
      <div className="App">
        <h1>Movie App</h1>
        <Routes>
          <Route path="/" element={<MovieList movies={movies} />} />
          <Route
            path="/movie/:id"
            element={
              <MovieRouteWrapper />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

// Helper to extract `id` param and pass to MovieDetail
function MovieRouteWrapper() {
  const id = window.location.pathname.split('/').pop();
  return <MovieDetail id={id} />;
}

export default App;
