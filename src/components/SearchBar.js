import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Button, Box } from "@mui/material";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = e => {
    e.preventDefault();
    onSearch(query.trim() ? query : "");
  };

  return (
    <Box
      component="form"
      className="search-bar-container"
      onSubmit={handleSearch}
      sx={{ display: "flex", gap: 2, mb: 4 }}
    >
      <TextField
        label="Search for a movie..."
        variant="outlined"
        fullWidth
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!query.trim()}
      >
        Search
      </Button>
    </Box>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
export default React.memo(SearchBar);
