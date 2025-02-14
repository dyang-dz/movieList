import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./LuckyDraw.css";

const LuckyDraw = ({ movies }) => {
  const navigate = useNavigate();
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const intervalRef = useRef(null);
  const currentMovieRef = useRef(null);

  const handleShuffle = useCallback(() => {
    if (movies.length > 0 && !isShuffling) {
      setIsShuffling(true);
      intervalRef.current = setInterval(() => {
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        setCurrentMovie(randomMovie);
        currentMovieRef.current = randomMovie;
      }, 100);

      setTimeout(() => {
        clearInterval(intervalRef.current);
        const selectedMovie = currentMovieRef.current || movies[0];
        navigate(`/movie/${selectedMovie.id}`);
      }, 800);
    }
  }, [isShuffling, movies, navigate]);

  return (
    <Box className="lucky-draw-container">
      <Button onClick={handleShuffle} disabled={isShuffling}>
        {isShuffling ? "Shuffling..." : "Shuffle and Surprise"}
      </Button>
      {isShuffling && (
        <div className="overlay">
          <div className="overlay-text">
            {currentMovie ? currentMovie.title : "Loading..."}
          </div>
        </div>
      )}
    </Box>
  );
};

LuckyDraw.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
    })
  ).isRequired,
};

export default React.memo(LuckyDraw);
