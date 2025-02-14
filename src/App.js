import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container, CssBaseline, Typography, Box, Button } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MovieList from "./components/MovieList";
import SearchBar from "./components/SearchBar";
import SortMenu from "./components/SortMenu";
import LuckyDraw from "./components/LuckyDraw";
import "./App.css";

const MovieDetail = lazy(() => import("./components/MovieDetail"));
const FavoritesPage = lazy(() => import("./components/FavoritesPage"));
const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL = "https://api.themoviedb.org/3/movie/popular";
const SEARCH_URL = "https://api.themoviedb.org/3/search/movie";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#ff4081" },
    background: { default: "#f5f5f5" },
  },
});

const App = () => {
  const [movies, setMovies] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!isSearching) {
      fetchMovies(query, page);
    }
  }, [page, isSearching, query]);

  useEffect(() => {
    if (query || sortOrder) {
      fetchMovies(query, 1, true);
    }
  }, [query, sortOrder]);

  const toggleFavorite = useCallback(movie => {
    setFavorites(prev => {
      const isFavorited = prev.some(fav => fav.id === movie.id);
      const updatedFavorites = isFavorited
        ? prev.filter(fav => fav.id !== movie.id)
        : [...prev, movie];
      return updatedFavorites;
    });
  });

  const responseDataAdapter = data => {
    let results = data.results;
    if (!Array.isArray(results)) {
      results = results && typeof results === "object" ? [results] : [];
    }
    return {
      ...data,
      results: results.map(movie => ({
        id: movie.id || 0,
        title: movie.title || "default title",
        poster_path: movie.poster_path || "/default.jpg",
        vote_average:
          movie.vote_average !== undefined ? movie.vote_average : "N/A",
        release_date: movie.release_date || "1970-01-01",
        ...movie,
      })),
    };
  };

  const fetchMovies = async (
    searchQuery = "",
    currentPage = 1,
    reset = false
  ) => {
    try {
      let url = searchQuery
        ? `${SEARCH_URL}?query=${searchQuery}&api_key=${API_KEY}&page=${currentPage}`
        : `${API_URL}?api_key=${API_KEY}&page=${currentPage}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorMessage = `API request failed with status ${response.status}`;
        console.error(errorMessage);
        setError(errorMessage);
        return;
      }

      const data = await response.json();

      const normalizedData = responseDataAdapter(data);

      if (!normalizedData.results || !Array.isArray(normalizedData.results)) {
        const errorMessage = "API returned unexpected format";
        console.error(errorMessage, normalizedData);
        setError(errorMessage);
        return;
      }

      setError(null);

      let results = normalizedData.results;
      if (sortOrder) {
        results = results.sort((a, b) => {
          if (sortOrder === "asc") return a.title.localeCompare(b.title);
          if (sortOrder === "desc") return b.title.localeCompare(a.title);
          return 0;
        });
      }

      if (reset) {
        setMovies([]);
        setTimeout(() => {
          setMovies(results);
        }, 100);
        setPage(1);
        setHasMore(results.length > 0);
      } else {
        setMovies(prev => [...prev, ...results]);
      }
      if (page >= 2) setHasMore(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("An unexpected error occured");
    }
  };

  const handleSearch = useCallback(searchQuery => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setMovies([]);
    setQuery(searchQuery);
    setPage(1);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timer = setTimeout(() => {
      setQuery(searchQuery);
    }, 2000);
    setSearchTimeout(timer);
  });

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      hasMore &&
      !isSearching
    ) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isSearching]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container className="container">
          <Typography
            variant="h4"
            align="center"
            sx={{ mt: 4, fontWeight: 600 }}
            component={Link}
            to="/"
            className="tmdb-title"
          >
            TMDB Movie List
          </Typography>
          {error && (
            <Box mt={2}>
              <Typography variant="body1" color="error" align="center">
                {error}
              </Typography>
            </Box>
          )}
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <SearchBar onSearch={handleSearch} />
                    </Box>
                    <Box className="button-container">
                      <LuckyDraw movies={movies} />
                      <Link to="/favorites">
                        <Button className="favorites-button">
                          Check My Favorite
                        </Button>
                      </Link>
                    </Box>
                    <SortMenu setSortOrder={setSortOrder} />
                    <MovieList
                      className="main"
                      movies={movies}
                      sortOrder={sortOrder}
                      toggleFavorite={toggleFavorite}
                      favorites={favorites}
                    />
                    {!hasMore && !isSearching && (
                      <Button
                        onClick={() => {
                          setHasMore(true);
                          setPage(page + 1);
                        }}
                        color="primary"
                        className="button"
                      >
                        Read more
                      </Button>
                    )}
                  </>
                }
              />
              <Route
                path="/favorites"
                element={
                  <FavoritesPage
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                  />
                }
              />
              <Route path="/movie/:id" element={<MovieDetail />} />
            </Routes>
          </Suspense>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
