import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, MenuItem, Select } from "@mui/material";
import MovieCard from "./MovieCard";

const FavoritesPage = ({ favorites = [], toggleFavorite }) => {
  const [sortOrder, setSortOrder] = useState("");
  const sortedFavorites = [...(favorites || [])].sort((a, b) => {
    switch (sortOrder) {
      case "rating_high":
        return (b.vote_average || 0) - (a.vote_average || 0);
      case "rating_low":
        return (a.vote_average || 0) - (b.vote_average || 0);
      case "date_new":
        return (
          new Date(b.release_date ?? "1970-01-01") -
          new Date(a.release_date ?? "1970-01-01")
        );
      case "date_old":
        return (
          new Date(a.release_date ?? "1970-01-01") -
          new Date(b.release_date ?? "1970-01-01")
        );
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Typography
        variant="h4"
        textAlign="center"
        className="tmdb-title"
        sx={{ mt: 4, mb: 2 }}
      >
        Check my favorite
      </Typography>

      {favorites.length === 0 ? (
        <Typography textAlign="center" color="textSecondary" sx={{ mt: 2 }}>
          Add some to favorites!
        </Typography>
      ) : (
        <>
          <Select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            displayEmpty
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="rating_high">Rating (High → Low)</MenuItem>
            <MenuItem value="rating_low">Rating (Low → High)</MenuItem>
            <MenuItem value="date_new">Release Date (New → Old)</MenuItem>
            <MenuItem value="date_old">Release Date (Old → New)</MenuItem>
            <MenuItem value="title">Title (A → Z)</MenuItem>
          </Select>

          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
            {sortedFavorites.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

FavoritesPage.propTypes = {
  favorites: PropTypes.array,
  toggleFavorite: PropTypes.func,
};

export default FavoritesPage;
