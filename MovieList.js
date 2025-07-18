import React from 'react';
import { Link } from 'react-router-dom';
import './MovieList.css';

function MovieList({ movies }) {
  return (
    <div className="movie-grid">
      {movies.map(movie => (
        <div className="movie-card" key={movie.id}>
          <h2>{movie.title}</h2>
          <p>{movie.tagline}</p>
          <p>⭐ {movie.vote_average} / 10</p>
          <Link to={`/movie/${movie.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}

export default MovieList;
