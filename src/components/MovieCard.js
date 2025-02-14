import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Button,
} from "@mui/material";

const MovieCard = ({ movie, toggleFavorite, favorites }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(favorites?.some(fav => fav.id === movie.id));
  }, [favorites, movie.id]);

  return (
    <Card
      sx={{
        width: { xs: "100%", sm: 300 },
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <CardActionArea onClick={() => navigate(`/movie/${movie.id}`)}>
        <CardMedia
          component="img"
          height="450"
          image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
      </CardActionArea>
      <CardContent>
        <div className="movie-title-container">
          <Typography variant="h6" className="movie-title" noWrap>
            {movie.title}
          </Typography>
        </div>
        <Typography variant="body2" color="text.secondary">
          Rating: {movie.vote_average} | {movie.release_date}
        </Typography>
        <Button
          variant={isFavorite ? "contained" : "outlined"}
          color="secondary"
          fullWidth
          sx={{ mt: 1 }}
          onClick={e => {
            e.stopPropagation();
            toggleFavorite(movie);
            setIsFavorite(prev => !prev);
          }}
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Button>
      </CardContent>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    poster_path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    vote_average: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    release_date: PropTypes.string.isRequired,
  }).isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  favorites: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
};

export default MovieCard;
