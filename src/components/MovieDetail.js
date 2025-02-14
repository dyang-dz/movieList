import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
const API_KEY = process.env.REACT_APP_API_KEY;

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,reviews`
        );
        const data = await response.json();
        setMovie(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovieDetails();
  }, [id]);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h3">{movie.title}</Typography>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        style={{ width: "300px", borderRadius: "10px", margin: "20px 0" }}
      />
      <Typography variant="h5">Overview</Typography>
      <Typography>{movie.overview}</Typography>
      <Typography variant="h5" sx={{ mt: 2 }}>
        Cast
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {movie.credits?.cast?.slice(0, 5).map(actor => (
          <Box key={actor.id} sx={{ width: "120px", textAlign: "center" }}>
            <img
              src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
              alt={actor.name}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <Typography variant="body2">{actor.name}</Typography>
          </Box>
        ))}
      </Box>
      <Typography variant="h5" sx={{ mt: 2 }}>
        Director
      </Typography>
      <Typography>
        {movie.credits?.crew?.find(person => person.job === "Director")?.name ||
          "N/A"}
      </Typography>
      <Typography variant="h5" sx={{ mt: 2 }}>
        Trailer
      </Typography>
      {movie.videos?.results.length > 0 ? (
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
          title="Movie Trailer"
          allowFullScreen
          style={{ marginTop: "10px" }}
        />
      ) : (
        <Typography>No trailer available</Typography>
      )}
    </Box>
  );
};

export default MovieDetail;
