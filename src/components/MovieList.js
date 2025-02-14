import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import MovieCard from "./MovieCard";

const MovieList = ({ movies, sortOrder, toggleFavorite, favorites }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const getFlexValue = () => {
    if (isSmallScreen) return "1 1 100%";
    if (isMediumScreen) return "1 1 50%";
    if (isLargeScreen) return "1 1 33%";
    return "1 1 16.6%";
  };

  if (!movies || movies.length === 0) {
    return (
      <Typography variant="h6" align="center">
        No movies found.
      </Typography>
    );
  }

  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortOrder) {
      case "rating_high":
        return b.vote_average - a.vote_average;
      case "rating_low":
        return a.vote_average - b.vote_average;
      case "date_new":
        return new Date(b.release_date) - new Date(a.release_date);
      case "date_old":
        return new Date(a.release_date) - new Date(b.release_date);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 2,
        mt: 2,
      }}
    >
      {sortedMovies.map((movie, index) => (
        <Box
          key={`${movie.id}-${index}`}
          sx={{ flex: getFlexValue(), maxWidth: 300 }}
        >
          <MovieCard
            movie={movie}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
          />
        </Box>
      ))}
    </Box>
  );
};

MovieList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      vote_average: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      release_date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  sortOrder: PropTypes.string,
  toggleFavorite: PropTypes.func.isRequired,
  favorites: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
};

export default MovieList;
